import { Connector, ConnectorContext } from '../sdk/interfaces';

// Private state for the PostgreSQL connector
let isPolling = false;
let pollTimer: NodeJS.Timeout | null = null;
let pollInterval = 45000; // 45 seconds

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
    if (isPolling) {
      ctx.logger.info('postgres poll already running, skipping');
      return;
    }

    isPolling = true;
    ctx.logger.info('postgres poll started');

    try {
      // Start continuous polling
      pollTimer = setInterval(async () => {
        await performPostgresPoll(ctx);
      }, pollInterval);

      // Perform initial poll
      await performPostgresPoll(ctx);
      
    } catch (error) {
      ctx.logger.error(`Error in postgres poll: ${error}`);
      isPolling = false;
    }
  },
  
  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('postgres shutdown started');
    
    // Stop polling
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    
    isPolling = false;
    ctx.logger.info('postgres shutdown completed');
  },
};

// Helper function for PostgreSQL polling
async function performPostgresPoll(ctx: ConnectorContext) {
  try {
    const now = new Date();
    ctx.logger.info(`postgres performing poll at ${now.toISOString()}`);

    // Check for new tables (simulated)
    await checkNewPostgresTables(ctx);
    
    // Check for schema changes (simulated)
    await checkPostgresSchemaChanges(ctx);

    ctx.logger.info('postgres poll completed successfully');
    
  } catch (error) {
    ctx.logger.error(`Error in postgres performPoll: ${error}`);
  }
}

async function checkNewPostgresTables(ctx: ConnectorContext) {
  ctx.logger.info('postgres checking for new tables');
  
  // Simulate detecting new tables
  const newTables = [
    {
      assetId: 'pg.public.users',
      assetType: 'TABLE' as const,
      name: 'users',
      namespace: 'public',
      sourceSystem: 'pg',
      schema: {
        columns: [
          { name: 'user_id', dataType: 'uuid' },
          { name: 'username', dataType: 'varchar(50)' },
          { name: 'email', dataType: 'varchar(100)' },
          { name: 'created_at', dataType: 'timestamp' }
        ]
      },
      owners: ['admin-team@company.com'],
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const table of newTables) {
    await ctx.emitAsset(table);
  }
}

async function checkPostgresSchemaChanges(ctx: ConnectorContext) {
  ctx.logger.info('postgres checking for schema changes');
  
  // Simulate detecting schema changes
  const schemaChanges = [
    {
      assetId: 'pg.public.sample_table.status',
      columnName: 'status',
      dataType: 'varchar(20)',
      observedAt: new Date().toISOString()
    }
  ];

  for (const change of schemaChanges) {
    await ctx.emitAsset({
      assetId: change.assetId,
      assetType: 'COLUMN',
      name: change.columnName,
      namespace: 'public',
      sourceSystem: 'pg',
      schema: { columns: [{ name: change.columnName, dataType: change.dataType }] },
      owners: ['data-team@company.com'],
      updatedAt: change.observedAt,
    });
  }
} 