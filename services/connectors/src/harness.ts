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

  console.log('Starting connectors with continuous polling...');
  
  // Run all connectors - they will start their polling operations
  await runConnector(PostgresConnector, context);
  await runConnector(TableauConnector, context);
  await runConnector(MySQLConnector, context);
  
  console.log('All connectors started. Keeping process alive for continuous polling...');
  
  // Keep the process alive for continuous polling
  // The connectors will run their polling operations in the background
  process.on('SIGINT', async () => {
    console.log('Shutting down connectors...');
    
    // Shutdown all connectors gracefully
    await PostgresConnector.shutdown?.(context);
    await TableauConnector.shutdown?.(context);
    await MySQLConnector.shutdown?.(context);
    
    await producer.disconnect();
    console.log('Shutdown complete');
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down...');
    
    // Shutdown all connectors gracefully
    await PostgresConnector.shutdown?.(context);
    await TableauConnector.shutdown?.(context);
    await MySQLConnector.shutdown?.(context);
    
    await producer.disconnect();
    console.log('Shutdown complete');
    process.exit(0);
  });
  
  // Keep the process running
  setInterval(() => {
    // Heartbeat to keep the process alive
    console.log('Connectors running...');
  }, 60000); // Log every minute
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 