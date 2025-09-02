import { Connector, ConnectorContext } from '../sdk/interfaces.js';

// Private state for the MySQL connector
let lastPollTime: Date | null = null;
let pollInterval = 30000; // 30 seconds
let isPolling = false;
let pollTimer: NodeJS.Timeout | null = null;

export const MySQLConnector: Connector = {
  type: 'mysql',
  name: 'MySQL',
  
  async init(ctx: ConnectorContext) {
    ctx.logger.info('mysql init');
    lastPollTime = new Date();
  },
  
  async discover(ctx: ConnectorContext) {
    ctx.logger.info('mysql discover');
    const now = new Date().toISOString();
    
    // Sample MySQL assets
    const mysqlAssets = [
      {
        assetId: 'mysql.sales.customers',
        assetType: 'TABLE' as const,
        name: 'customers',
        namespace: 'sales',
        sourceSystem: 'mysql',
        schema: {
          columns: [
            { name: 'customer_id', dataType: 'int' },
            { name: 'first_name', dataType: 'varchar(50)' },
            { name: 'last_name', dataType: 'varchar(50)' },
            { name: 'email', dataType: 'varchar(100)' },
            { name: 'phone', dataType: 'varchar(20)' },
            { name: 'created_at', dataType: 'timestamp' },
            { name: 'updated_at', dataType: 'timestamp' }
          ]
        },
        owners: ['data-team@company.com'],
        updatedAt: now,
      },
      {
        assetId: 'mysql.sales.orders',
        assetType: 'TABLE' as const,
        name: 'orders',
        namespace: 'sales',
        sourceSystem: 'mysql',
        schema: {
          columns: [
            { name: 'order_id', dataType: 'int' },
            { name: 'customer_id', dataType: 'int' },
            { name: 'order_date', dataType: 'date' },
            { name: 'total_amount', dataType: 'decimal(10,2)' },
            { name: 'status', dataType: 'enum' },
            { name: 'created_at', dataType: 'timestamp' }
          ]
        },
        owners: ['sales-team@company.com'],
        updatedAt: now,
      },
      {
        assetId: 'mysql.sales.order_items',
        assetType: 'TABLE' as const,
        name: 'order_items',
        namespace: 'sales',
        sourceSystem: 'mysql',
        schema: {
          columns: [
            { name: 'order_item_id', dataType: 'int' },
            { name: 'order_id', dataType: 'int' },
            { name: 'product_id', dataType: 'int' },
            { name: 'quantity', dataType: 'int' },
            { name: 'unit_price', dataType: 'decimal(10,2)' },
            { name: 'total_price', dataType: 'decimal(10,2)' }
          ]
        },
        owners: ['sales-team@company.com'],
        updatedAt: now,
      },
      {
        assetId: 'mysql.inventory.products',
        assetType: 'TABLE' as const,
        name: 'products',
        namespace: 'inventory',
        sourceSystem: 'mysql',
        schema: {
          columns: [
            { name: 'product_id', dataType: 'int' },
            { name: 'product_name', dataType: 'varchar(100)' },
            { name: 'category', dataType: 'varchar(50)' },
            { name: 'price', dataType: 'decimal(10,2)' },
            { name: 'stock_quantity', dataType: 'int' },
            { name: 'supplier_id', dataType: 'int' },
            { name: 'created_at', dataType: 'timestamp' }
          ]
        },
        owners: ['inventory-team@company.com'],
        updatedAt: now,
      },
      {
        assetId: 'mysql.sales.customer_summary',
        assetType: 'VIEW' as const,
        name: 'customer_summary',
        namespace: 'sales',
        sourceSystem: 'mysql',
        schema: {
          columns: [
            { name: 'customer_id', dataType: 'int' },
            { name: 'customer_name', dataType: 'varchar(100)' },
            { name: 'total_orders', dataType: 'int' },
            { name: 'total_spent', dataType: 'decimal(10,2)' },
            { name: 'last_order_date', dataType: 'date' }
          ]
        },
        owners: ['analytics-team@company.com'],
        updatedAt: now,
      }
    ];

    // Emit all MySQL assets
    for (const asset of mysqlAssets) {
      await ctx.emitAsset(asset);
    }

    // Emit some lineage relationships
    const lineageEvents = [
      {
        upstream: { assetId: 'mysql.sales.customers' },
        downstream: { assetId: 'mysql.sales.orders' },
        observedAt: now,
      },
      {
        upstream: { assetId: 'mysql.sales.orders' },
        downstream: { assetId: 'mysql.sales.order_items' },
        observedAt: now,
      },
      {
        upstream: { assetId: 'mysql.inventory.products' },
        downstream: { assetId: 'mysql.sales.order_items' },
        observedAt: now,
      },
      {
        upstream: { assetId: 'mysql.sales.customers' },
        downstream: { assetId: 'mysql.sales.customer_summary' },
        observedAt: now,
      },
      {
        upstream: { assetId: 'mysql.sales.orders' },
        downstream: { assetId: 'mysql.sales.customer_summary' },
        observedAt: now,
      }
    ];

    // Emit lineage events
    for (const lineageEvent of lineageEvents) {
      await ctx.emitLineage(lineageEvent);
    }
  },
  
  async poll(ctx: ConnectorContext) {
    if (isPolling) {
      ctx.logger.info('mysql poll already running, skipping');
      return;
    }

    isPolling = true;
    ctx.logger.info('mysql poll started');

    try {
      // Start continuous polling
      pollTimer = setInterval(async () => {
        await performPoll(ctx);
      }, pollInterval);

      // Perform initial poll
      await performPoll(ctx);
      
    } catch (error) {
      ctx.logger.error(`Error in mysql poll: ${error}`);
      isPolling = false;
    }
  },

  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('mysql shutdown started');
    
    // Stop polling
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    
    isPolling = false;
    ctx.logger.info('mysql shutdown completed');
  },
};

// Helper functions for polling
async function performPoll(ctx: ConnectorContext) {
  try {
    const now = new Date();
    ctx.logger.info(`mysql performing poll at ${now.toISOString()}`);

    // Check for schema changes (simulated)
    await checkSchemaChanges(ctx);
    
    // Check for new tables (simulated)
    await checkNewTables(ctx);
    
    // Check for data lineage updates (simulated)
    await checkLineageUpdates(ctx);
    
    // Check for data quality issues (simulated)
    await checkDataQuality(ctx);

    lastPollTime = now;
    ctx.logger.info('mysql poll completed successfully');
    
  } catch (error) {
    ctx.logger.error(`Error in mysql performPoll: ${error}`);
  }
}

async function checkSchemaChanges(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for schema changes');
  
  // Simulate detecting schema changes
  const schemaChanges = [
    {
      assetId: 'mysql.sales.customers.middle_name',
      columnName: 'middle_name',
      dataType: 'varchar(50)',
      observedAt: new Date().toISOString()
    }
  ];

  for (const change of schemaChanges) {
    await ctx.emitAsset({
      assetId: change.assetId,
      assetType: 'COLUMN',
      name: change.columnName,
      namespace: 'sales',
      sourceSystem: 'mysql',
      schema: { columns: [{ name: change.columnName, dataType: change.dataType }] },
      owners: ['data-team@company.com'],
      updatedAt: change.observedAt,
    });
  }
}

async function checkNewTables(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for new tables');
  
  // Simulate detecting new tables
  const newTables = [
    {
      assetId: 'mysql.sales.promotions',
      assetType: 'TABLE' as const,
      name: 'promotions',
      namespace: 'sales',
      sourceSystem: 'mysql',
      schema: {
        columns: [
          { name: 'promotion_id', dataType: 'int' },
          { name: 'promotion_name', dataType: 'varchar(100)' },
          { name: 'discount_percent', dataType: 'decimal(5,2)' },
          { name: 'start_date', dataType: 'date' },
          { name: 'end_date', dataType: 'date' },
          { name: 'created_at', dataType: 'timestamp' }
        ]
      },
      owners: ['marketing-team@company.com'],
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const table of newTables) {
    await ctx.emitAsset(table);
  }
}

async function checkLineageUpdates(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for lineage updates');
  
  // Simulate detecting new lineage relationships
  const newLineage = [
    {
      upstream: { assetId: 'mysql.sales.promotions' },
      downstream: { assetId: 'mysql.sales.orders' },
      transformation: {
        type: 'SQL' as const,
        expression: 'JOIN promotions ON orders.promotion_id = promotions.promotion_id'
      },
      observedAt: new Date().toISOString(),
    }
  ];

  for (const lineage of newLineage) {
    await ctx.emitLineage(lineage);
  }
}

async function checkDataQuality(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking data quality');
  
  // Simulate data quality checks
  const qualityIssues = [
    {
      assetId: 'mysql.sales.customers',
      issueType: 'NULL_VALUES',
      columnName: 'email',
      severity: 'WARNING',
      message: 'Found 5 customers with null email addresses',
      observedAt: new Date().toISOString()
    }
  ];

  // Log quality issues (could also emit to a quality topic)
  for (const issue of qualityIssues) {
    ctx.logger.info(`Data quality issue: ${issue.message}`);
  }
}
