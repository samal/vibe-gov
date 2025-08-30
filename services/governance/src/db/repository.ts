import pkg from 'pg';
import { User, Role, DataClassification, MaskingRule, AuditEvent, LoginRequest } from '../types';

const { Pool } = pkg;

export class GovernanceRepository {
  private pool: pkg.Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.PGHOST || 'postgres',
      user: process.env.PGUSER || 'lineage',
      password: process.env.PGPASSWORD || 'lineage',
      database: process.env.PGDATABASE || 'lineage',
      port: Number(process.env.PGPORT || '5432'),
    });
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // User management
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const result = await this.pool.query(
      'INSERT INTO users (external_id, email, display_name) VALUES ($1, $2, $3) RETURNING *',
      [user.externalId, user.email, user.displayName]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Role management
  async getRoles(): Promise<Role[]> {
    const result = await this.pool.query('SELECT * FROM roles ORDER BY name');
    return result.rows;
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const result = await this.pool.query(
      'SELECT r.* FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
      [userId]
    );
    return result.rows;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, roleId]
    );
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.pool.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
  }

  // Classification management
  async getClassifications(): Promise<DataClassification[]> {
    const result = await this.pool.query('SELECT * FROM classifications ORDER BY key');
    return result.rows;
  }

  async createClassification(classification: Omit<DataClassification, 'id'>): Promise<DataClassification> {
    const result = await this.pool.query(
      'INSERT INTO classifications (key, label, description) VALUES ($1, $2, $3) RETURNING *',
      [classification.key, classification.label, classification.description]
    );
    return result.rows[0];
  }

  async assignClassificationToAsset(assetId: string, classificationKey: string, assignedBy: number): Promise<void> {
    await this.pool.query(
      'INSERT INTO asset_classifications (asset_id, classification_key, assigned_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [assetId, classificationKey, assignedBy]
    );
  }

  async getAssetClassifications(assetId: string): Promise<DataClassification[]> {
    const result = await this.pool.query(
      'SELECT c.* FROM classifications c JOIN asset_classifications ac ON c.key = ac.classification_key WHERE ac.asset_id = $1',
      [assetId]
    );
    return result.rows;
  }

  // Masking rules
  async getMaskingRules(): Promise<MaskingRule[]> {
    const result = await this.pool.query('SELECT * FROM masking_rules ORDER BY name');
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      classificationKey: row.classification_key,
      roleId: row.role_id,
      maskingType: row.masking_type,
      maskingConfig: row.masking_config,
      enabled: row.enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async createMaskingRule(rule: Omit<MaskingRule, 'id'>): Promise<MaskingRule> {
    const result = await this.pool.query(
      'INSERT INTO masking_rules (name, classification_key, role_id, masking_type, masking_config, enabled) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [rule.name, rule.classificationKey, rule.roleId, rule.maskingType, rule.maskingConfig, rule.enabled]
    );
    return result.rows[0];
  }

  async updateMaskingRule(id: number, updates: Partial<MaskingRule>): Promise<MaskingRule> {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const values = Object.values(updates);
    const setClause = fields.map((_, i) => `${fields[i]} = $${i + 2}`).join(', ');
    
    const result = await this.pool.query(
      `UPDATE masking_rules SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  // Audit logging
  async logAuditEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent> {
    const result = await this.pool.query(
      'INSERT INTO audit_logs_enhanced (actor_user_id, action, entity_type, entity_id, resource_type, resource_id, old_values, new_values, ip_address, user_agent, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        event.actorUserId,
        event.action,
        event.entityType,
        event.entityId,
        event.resourceType,
        event.resourceId,
        event.oldValues,
        event.newValues,
        event.ipAddress,
        event.userAgent,
        event.metadata
      ]
    );
    return result.rows[0];
  }

  // Data Assets
  async getDataAssets(): Promise<any[]> {
    // Get assets from data_assets table
    const dataAssetsResult = await this.pool.query('SELECT * FROM data_assets ORDER BY name');
    const dataAssets = dataAssetsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      namespace: row.namespace,
      sourceSystem: row.source_system,
      assetType: row.asset_type,
      schema: row.schema,
      owners: row.owners,
      updatedAt: row.updated_at,
    }));

    // Get assets from audit logs (connector ingested assets)
    const auditAssetsResult = await this.pool.query(`
      SELECT DISTINCT 
        metadata->>'assetId' as id,
        metadata->>'name' as name,
        metadata->>'namespace' as namespace,
        metadata->>'sourceSystem' as source_system,
        metadata->>'assetType' as asset_type,
        metadata->'schema' as schema,
        metadata->'owners' as owners,
        created_at as updated_at
      FROM audit_logs 
      WHERE action = 'INGEST_ASSET' 
      AND metadata->>'assetId' IS NOT NULL
      ORDER BY name
    `);
    
    const auditAssets = auditAssetsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      namespace: row.namespace,
      sourceSystem: row.source_system,
      assetType: row.asset_type,
      schema: row.schema,
      owners: row.owners,
      updatedAt: row.updated_at,
    }));

    // Combine and deduplicate by ID
    const allAssets = [...dataAssets, ...auditAssets];
    const uniqueAssets = allAssets.filter((asset, index, self) => 
      index === self.findIndex(a => a.id === asset.id)
    );

    return uniqueAssets;
  }

  async getDataAssetById(id: string): Promise<any | null> {
    const result = await this.pool.query('SELECT * FROM data_assets WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      namespace: row.namespace,
      sourceSystem: row.source_system,
      assetType: row.asset_type,
      schema: row.schema,
      owners: row.owners,
      updatedAt: row.updated_at,
    };
  }

  async createDataAsset(asset: any): Promise<any> {
    const id = `${asset.sourceSystem}.${asset.namespace}.${asset.name}`;
    const result = await this.pool.query(
      'INSERT INTO data_assets (id, name, namespace, source_system, asset_type, schema, owners) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, asset.name, asset.namespace, asset.sourceSystem, asset.assetType, JSON.stringify(asset.schema), JSON.stringify(asset.owners)]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      namespace: row.namespace,
      sourceSystem: row.source_system,
      assetType: row.asset_type,
      schema: row.schema,
      owners: row.owners,
      updatedAt: row.updated_at,
    };
  }

  async updateDataAsset(id: string, updates: any): Promise<any> {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const values = Object.values(updates);
    const setClause = fields.map((_, i) => {
      const field = fields[i];
      const dbField = field === 'sourceSystem' ? 'source_system' : 
                     field === 'assetType' ? 'asset_type' : field;
      return `${dbField} = $${i + 2}`;
    }).join(', ');
    
    const result = await this.pool.query(
      `UPDATE data_assets SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      namespace: row.namespace,
      sourceSystem: row.source_system,
      assetType: row.asset_type,
      schema: row.schema,
      owners: row.owners,
      updatedAt: row.updated_at,
    };
  }

  async deleteDataAsset(id: string): Promise<void> {
    await this.pool.query('DELETE FROM data_assets WHERE id = $1', [id]);
  }

  async getAuditEvents(filters: {
    entityType?: string;
    entityId?: string;
    actorUserId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditEvent[]> {
    let query = 'SELECT * FROM audit_logs_enhanced WHERE 1=1';
    const values: unknown[] = [];
    let paramCount = 0;

    if (filters.entityType) {
      paramCount++;
      query += ` AND entity_type = $${paramCount}`;
      values.push(filters.entityType);
    }

    if (filters.entityId) {
      paramCount++;
      query += ` AND entity_id = $${paramCount}`;
      values.push(filters.entityId);
    }

    if (filters.actorUserId) {
      paramCount++;
      query += ` AND actor_user_id = $${paramCount}`;
      values.push(filters.actorUserId);
    }

    if (filters.startDate) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      values.push(filters.endDate);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
    }

    if (filters.offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await this.pool.query(query, values);
    return result.rows;
  }
}
