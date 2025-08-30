import { Connector, ConnectorContext } from '../sdk/interfaces';

export const PostgresConnector: Connector = {
  type: 'postgres',
  name: 'PostgreSQL',
  async init(ctx: ConnectorContext) {
    ctx.logger.info('postgres init');
  },
  async discover(ctx: ConnectorContext) {
    ctx.logger.info('postgres discover');
    const now = new Date().toISOString();
    await ctx.emitAsset({
      assetId: 'pg.public.sample_table',
      assetType: 'TABLE',
      name: 'sample_table',
      namespace: 'public',
      sourceSystem: 'pg',
      schema: { columns: [{ name: 'id', dataType: 'int4' }] },
      owners: [],
      updatedAt: now,
    });
  },
  async poll(ctx: ConnectorContext) {
    ctx.logger.info('postgres poll');
  },
  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('postgres shutdown');
  },
}; 