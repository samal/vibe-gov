import { Connector, ConnectorContext } from './interfaces';

export async function runConnector(connector: Connector, context: ConnectorContext): Promise<void> {
  context.logger.info({ msg: 'starting connector', name: connector.name, type: connector.type });
  if (connector.init) await connector.init(context);
  if (connector.discover) await connector.discover(context);
  if (connector.poll) await connector.poll(context);
  if (connector.shutdown) await connector.shutdown(context);
  context.logger.info({ msg: 'finished connector', name: connector.name });
} 