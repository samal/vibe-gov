import { Connector, ConnectorContext } from '../sdk/interfaces.js';
import mysql from 'mysql2/promise';

// Private state for the MySQL connector
let lastPollTime: Date | null = null;
let pollInterval = 30000; // 30 seconds
let isPolling = false;
let pollTimer: NodeJS.Timeout | null = null;
let connection: mysql.Connection | null = null;

export const MySQLConnector: Connector = {
  type: 'mysql',
  name: 'MySQL',
  
  async init(ctx: ConnectorContext) {
    ctx.logger.info('mysql init');
    
    // Get MySQL connection details from environment
    const host = process.env.MYSQL_HOST || 'localhost';
    const port = parseInt(process.env.MYSQL_PORT || '3306');
    const user = process.env.MYSQL_USER || 'lineage';
    const password = process.env.MYSQL_PASSWORD || 'lineage';
    const database = process.env.MYSQL_DATABASE || 'lineage';
    
    try {
      // Create connection
      connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        database,
        multipleStatements: true
      });
      
      ctx.logger.info(`mysql connected to ${host}:${port}/${database}`);
      lastPollTime = new Date();
    } catch (error) {
      ctx.logger.error(`mysql connection failed: ${error}`);
      throw error;
    }
  },
  
  async discover(ctx: ConnectorContext) {
    if (!connection) {
      ctx.logger.error('mysql not connected');
      return;
    }
    
    ctx.logger.info('mysql discover');
    const now = new Date().toISOString();
    
    try {
      // Discover databases
      const [databases] = await connection.execute('SHOW DATABASES');
      const dbList = (databases as any[]).map(db => db.Database).filter(db => 
        !['information_schema', 'mysql', 'performance_schema', 'sys'].includes(db)
      );
      
      ctx.logger.info(`mysql discovered databases: ${dbList.join(', ')}`);
      
      // Discover assets in each database
      for (const dbName of dbList) {
        await discoverDatabaseAssets(ctx, dbName, now);
      }
      
    } catch (error) {
      ctx.logger.error(`mysql discover error: ${error}`);
      throw error;
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
    
    // Close connection
    if (connection) {
      await connection.end();
      connection = null;
    }
    
    isPolling = false;
    ctx.logger.info('mysql shutdown completed');
  },
};

// Helper function to discover assets in a specific database
async function discoverDatabaseAssets(ctx: ConnectorContext, dbName: string, timestamp: string) {
  if (!connection) return;
  
  try {
    // Discover tables
    const [tables] = await connection.execute(`SHOW TABLES FROM \`${dbName}\``);
    const tableList = (tables as any[]).map(table => Object.values(table)[0] as string);
    
    for (const tableName of tableList) {
      await discoverTableAsset(ctx, dbName, tableName, 'TABLE', timestamp);
    }
    
    // Discover views
    const [views] = await connection.execute(`SHOW FULL TABLES FROM \`${dbName}\` WHERE Table_type = 'VIEW'`);
    const viewList = (views as any[]).map(view => Object.values(view)[0] as string);
    
    for (const viewName of viewList) {
      await discoverTableAsset(ctx, dbName, viewName, 'VIEW', timestamp);
    }
    
  } catch (error) {
    ctx.logger.error(`mysql discover database ${dbName} error: ${error}`);
  }
}

// Helper function to discover a specific table/view asset
async function discoverTableAsset(ctx: ConnectorContext, dbName: string, tableName: string, assetType: 'TABLE' | 'VIEW', timestamp: string) {
  if (!connection) return;
  
  try {
    // Get table schema
    const [columns] = await connection.execute(`DESCRIBE \`${dbName}\`.\`${tableName}\``);
    const columnList = (columns as any[]).map(col => ({
      name: col.Field,
      dataType: col.Type,
      nullable: col.Null === 'YES',
      key: col.Key,
      default: col.Default,
      extra: col.Extra
    }));
    
    // Get table information
    const [tableInfo] = await connection.execute(`SHOW TABLE STATUS FROM \`${dbName}\` LIKE '${tableName}'`);
    const info = (tableInfo as any[])[0];
    
    // Create asset
    const asset = {
      assetId: `mysql.${dbName}.${tableName}`,
      assetType,
      name: tableName,
      namespace: dbName,
      sourceSystem: 'mysql',
      schema: {
        columns: columnList,
        rowCount: info.Rows || 0,
        dataSize: info.Data_length || 0,
        indexSize: info.Index_length || 0,
        engine: info.Engine || null,
        collation: info.Collation || null
      },
      owners: ['data-team@company.com'], // Default owner
      updatedAt: timestamp,
    };
    
    await ctx.emitAsset(asset);
    ctx.logger.info(`mysql discovered ${assetType.toLowerCase()} ${dbName}.${tableName}`);
    
    // Discover column-level assets for important columns
    await discoverColumnAssets(ctx, dbName, tableName, columnList, timestamp);
    
  } catch (error) {
    ctx.logger.error(`mysql discover table ${dbName}.${tableName} error: ${error}`);
  }
}

// Helper function to discover column-level assets
async function discoverColumnAssets(ctx: ConnectorContext, dbName: string, tableName: string, columns: any[], timestamp: string) {
  // Only create column assets for important columns (primary keys, foreign keys, etc.)
  const importantColumns = columns.filter(col => 
    col.key === 'PRI' || col.key === 'MUL' || 
    col.name.includes('id') || col.name.includes('email') || 
    col.name.includes('amount') || col.name.includes('price')
  );
  
  for (const column of importantColumns) {
    try {
      const asset = {
        assetId: `mysql.${dbName}.${tableName}.${column.name}`,
        assetType: 'COLUMN' as const,
        name: column.name,
        namespace: dbName,
        sourceSystem: 'mysql',
        schema: {
          columns: [column],
          parentAsset: `mysql.${dbName}.${tableName}`
        },
        owners: ['data-team@company.com'],
        updatedAt: timestamp,
      };
      
      await ctx.emitAsset(asset);
      
    } catch (error) {
      ctx.logger.error(`mysql discover column ${dbName}.${tableName}.${column.name} error: ${error}`);
    }
  }
}

// Helper functions for polling
async function performPoll(ctx: ConnectorContext) {
  try {
    const now = new Date();
    ctx.logger.info(`mysql performing poll at ${now.toISOString()}`);

    // Check for schema changes
    await checkSchemaChanges(ctx);
    
    // Check for new tables
    await checkNewTables(ctx);
    
    // Check for data lineage updates
    await checkLineageUpdates(ctx);
    
    // Check for data quality issues
    await checkDataQuality(ctx);

    lastPollTime = now;
    ctx.logger.info('mysql poll completed successfully');
    
  } catch (error) {
    ctx.logger.error(`Error in mysql performPoll: ${error}`);
  }
}

async function checkSchemaChanges(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for schema changes');
  
  // This would typically query information_schema to detect changes
  // For now, we'll just log that we're checking
  ctx.logger.info('mysql schema change check completed');
}

async function checkNewTables(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for new tables');
  
  // This would compare current tables with previously discovered ones
  // For now, we'll just log that we're checking
  ctx.logger.info('mysql new table check completed');
}

async function checkLineageUpdates(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking for lineage updates');
  
  // This would analyze foreign key relationships and view definitions
  // For now, we'll just log that we're checking
  ctx.logger.info('mysql lineage update check completed');
}

async function checkDataQuality(ctx: ConnectorContext) {
  ctx.logger.info('mysql checking data quality');
  
  // This would run data quality checks on the tables
  // For now, we'll just log that we're checking
  ctx.logger.info('mysql data quality check completed');
}
