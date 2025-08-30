import { runConnector } from './sdk/runner.js';
import { PostgresConnector } from './connectors/postgres.js';
import { TableauConnector } from './connectors/tableau.js';
import { MySQLConnector } from './connectors/mysql.js';
import { AssetEvent, LineageEvent } from './sdk/types.js';
import { Kafka, logLevel } from 'kafkajs';

async function main() {
  const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') ?? ['kafka:9092'];
  const kafka = new Kafka({ clientId: 'connectors', brokers: kafkaBrokers, logLevel: logLevel.ERROR });
  const producer = kafka.producer();
  await producer.connect();

  const context = {
    async emitAsset(event: AssetEvent) {
      await producer.send({ topic: 'metadata.assets.v1', messages: [{ key: event.assetId, value: JSON.stringify(event) }] });
    },
    async emitLineage(event: LineageEvent) {
      const key = `${event.upstream.assetId}->${event.downstream.assetId}`;
      await producer.send({ topic: 'metadata.lineage.v1', messages: [{ key, value: JSON.stringify(event) }] });
    },
    logger: { info: console.log, error: console.error },
  };

  await runConnector(PostgresConnector, context);
  await runConnector(TableauConnector, context);
  await runConnector(MySQLConnector, context);
  await producer.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 