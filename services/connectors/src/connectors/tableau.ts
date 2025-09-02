import { Connector, ConnectorContext } from '../sdk/interfaces';

// Private state for the Tableau connector
let isPolling = false;
let pollTimer: NodeJS.Timeout | null = null;
let pollInterval = 60000; // 60 seconds (Tableau changes less frequently)

export const TableauConnector: Connector = {
  type: 'tableau',
  name: 'Tableau',
  
  async init(ctx: ConnectorContext) {
    ctx.logger.info('tableau init');
  },
  
  async discover(ctx: ConnectorContext) {
    ctx.logger.info('tableau discover');
    const now = new Date().toISOString();
    
    // Sample Tableau assets
    const tableauAssets = [
      {
        assetId: 'tableau.sales.customer_dashboard',
        assetType: 'REPORT' as const,
        name: 'Customer Dashboard',
        namespace: 'sales',
        sourceSystem: 'tableau',
        schema: {
          columns: [
            { name: 'customer_count', dataType: 'number' },
            { name: 'total_revenue', dataType: 'currency' },
            { name: 'avg_order_value', dataType: 'currency' }
          ]
        },
        owners: ['analytics-team@company.com'],
        updatedAt: now,
      },
      {
        assetId: 'tableau.inventory.stock_monitoring',
        assetType: 'REPORT' as const,
        name: 'Stock Monitoring',
        namespace: 'inventory',
        sourceSystem: 'tableau',
        schema: {
          columns: [
            { name: 'product_name', dataType: 'string' },
            { name: 'current_stock', dataType: 'number' },
            { name: 'reorder_level', dataType: 'number' }
          ]
        },
        owners: ['inventory-team@company.com'],
        updatedAt: now,
      }
    ];

    // Emit all Tableau assets
    for (const asset of tableauAssets) {
      await ctx.emitAsset(asset);
    }
  },
  
  async poll(ctx: ConnectorContext) {
    if (isPolling) {
      ctx.logger.info('tableau poll already running, skipping');
      return;
    }

    isPolling = true;
    ctx.logger.info('tableau poll started');

    try {
      // Start continuous polling
      pollTimer = setInterval(async () => {
        await performTableauPoll(ctx);
      }, pollInterval);

      // Perform initial poll
      await performTableauPoll(ctx);
      
    } catch (error) {
      ctx.logger.error(`Error in tableau poll: ${error}`);
      isPolling = false;
    }
  },
  
  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('tableau shutdown started');
    
    // Stop polling
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    
    isPolling = false;
    ctx.logger.info('tableau shutdown completed');
  },
};

// Helper function for Tableau polling
async function performTableauPoll(ctx: ConnectorContext) {
  try {
    const now = new Date();
    ctx.logger.info(`tableau performing poll at ${now.toISOString()}`);

    // Check for new dashboards/reports
    await checkNewTableauAssets(ctx);
    
    // Check for dashboard updates
    await checkTableauUpdates(ctx);
    
    // Check for data source changes
    await checkTableauDataSources(ctx);

    ctx.logger.info('tableau poll completed successfully');
    
  } catch (error) {
    ctx.logger.error(`Error in tableau performPoll: ${error}`);
  }
}

async function checkNewTableauAssets(ctx: ConnectorContext) {
  ctx.logger.info('tableau checking for new assets');
  
  // Simulate detecting new dashboards
  const newAssets = [
    {
      assetId: 'tableau.finance.revenue_analysis',
      assetType: 'REPORT' as const,
      name: 'Revenue Analysis',
      namespace: 'finance',
      sourceSystem: 'tableau',
      schema: {
        columns: [
          { name: 'month', dataType: 'date' },
          { name: 'revenue', dataType: 'currency' },
          { name: 'growth_rate', dataType: 'percentage' }
        ]
      },
      owners: ['finance-team@company.com'],
      updatedAt: new Date().toISOString(),
    }
  ];

  for (const asset of newAssets) {
    await ctx.emitAsset(asset);
  }
}

async function checkTableauUpdates(ctx: ConnectorContext) {
  ctx.logger.info('tableau checking for updates');
  
  // Simulate detecting dashboard updates
  const updates = [
    {
      assetId: 'tableau.sales.customer_dashboard',
      updateType: 'LAYOUT_CHANGED',
      description: 'Dashboard layout updated with new filters',
      observedAt: new Date().toISOString()
    }
  ];

  // Log updates (could also emit to an updates topic)
  for (const update of updates) {
    ctx.logger.info(`Tableau update: ${update.description}`);
  }
}

async function checkTableauDataSources(ctx: ConnectorContext) {
  ctx.logger.info('tableau checking data sources');
  
  // Simulate detecting data source changes
  const dataSourceChanges = [
    {
      assetId: 'tableau.sales.customer_dashboard',
      changeType: 'DATA_SOURCE_UPDATED',
      sourceName: 'mysql.sales.customers',
      observedAt: new Date().toISOString()
    }
  ];

  // Log data source changes
  for (const change of dataSourceChanges) {
    ctx.logger.info(`Data source change: ${change.changeType} for ${change.sourceName}`);
  }
} 