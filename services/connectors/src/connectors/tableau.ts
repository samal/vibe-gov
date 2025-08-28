import { Connector, ConnectorContext } from '../sdk/interfaces';

export const TableauConnector: Connector = {
  type: 'tableau',
  name: 'Tableau',
  async init(ctx: ConnectorContext) {
    ctx.logger.info('tableau init');
  },
  async discover(ctx: ConnectorContext) {
    ctx.logger.info('tableau discover');
  },
  async poll(ctx: ConnectorContext) {
    ctx.logger.info('tableau poll');
  },
  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('tableau shutdown');
  },
}; 