import { Connector, ConnectorContext } from '../sdk/interfaces.js';

export const MySQLConnector: Connector = {
  type: 'mysql',
  name: 'MySQL',
  async init(ctx: ConnectorContext) {
    ctx.logger.info('mysql init');
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
    ctx.logger.info('mysql poll');
  },
  async shutdown(ctx: ConnectorContext) {
    ctx.logger.info('mysql shutdown');
  },
};
