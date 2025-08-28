import Fastify from 'fastify';
import { Kafka, logLevel } from 'kafkajs';
import pkg from 'pg';
import neo4j from 'neo4j-driver';

const app = Fastify({ logger: true });
app.get('/health', async () => ({ status: 'ok' }));

const port = process.env.PORT ? Number(process.env.PORT) : 3002;

async function startConsumer() {
  const brokers = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'];
  const kafka = new Kafka({ clientId: 'ingestion', brokers, logLevel: logLevel.ERROR });
  const consumer = kafka.consumer({ groupId: 'ingestion-group' });

  const { Pool } = pkg;
  const pgPool = new Pool({
    host: process.env.PGHOST || 'postgres',
    user: process.env.PGUSER || 'lineage',
    password: process.env.PGPASSWORD || 'lineage',
    database: process.env.PGDATABASE || 'lineage',
    port: Number(process.env.PGPORT || '5432'),
  });

  const neo4jDriver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://neo4j:7687',
    neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'lineage123')
  );
  const neo4jSession = neo4jDriver.session();

  await consumer.connect();
  await consumer.subscribe({ topic: 'metadata.assets.v1', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      const payload = JSON.parse(message.value.toString());
      app.log.info({ topic, key: message.key?.toString() });

      await pgPool.query(
        'INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id, metadata) VALUES ($1,$2,$3,$4,$5)',
        [null, 'INGEST_ASSET', 'ASSET', payload.assetId, payload]
      );

      await neo4jSession.run(
        'MERGE (a:DataAsset {id: $id}) SET a.name = $name, a.namespace = $namespace, a.sourceSystem = $sourceSystem RETURN a',
        {
          id: payload.assetId,
          name: payload.name,
          namespace: payload.namespace,
          sourceSystem: payload.sourceSystem,
        }
      );
    },
  });
}

app
  .listen({ port, host: '0.0.0.0' })
  .then(async () => {
    app.log.info(`ingestion listening on ${port}`);
    startConsumer().catch((e) => {
      app.log.error(e);
      process.exit(1);
    });
  })
  .catch((err: unknown) => {
    app.log.error(err);
    process.exit(1);
  }); 