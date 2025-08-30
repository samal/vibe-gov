import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GovernanceRepository } from '../db/repository.js';
import { extractAuthContext, hasPermission } from '../auth/jwt.js';

const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  namespace: z.string(),
  sourceSystem: z.string(),
  assetType: z.enum(['TABLE', 'VIEW', 'COLUMN', 'REPORT']),
  schema: z.object({
    columns: z.array(z.object({
      name: z.string(),
      dataType: z.string(),
      classification: z.string().optional(),
    })).optional(),
  }).optional(),
  owners: z.array(z.string()).optional(),
  updatedAt: z.string(),
});

const createAssetSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  sourceSystem: z.string(),
  assetType: z.enum(['TABLE', 'VIEW', 'COLUMN', 'REPORT']),
  schema: z.object({
    columns: z.array(z.object({
      name: z.string(),
      dataType: z.string(),
      classification: z.string().optional(),
    })).optional(),
  }).optional(),
  owners: z.array(z.string()).optional(),
});

export async function registerAssetRoutes(app: FastifyInstance) {
  const repo = new GovernanceRepository();

  // Get all data assets
  app.get('/assets', async (request, reply) => {
    // TODO: Re-enable authentication for production
    // const authHeader = request.headers.authorization;
    // if (!authHeader?.startsWith('Bearer ')) {
    //   return reply.status(401).send({ error: 'Authorization required' });
    // }

    // const token = authHeader.substring(7);
    // const authContext = extractAuthContext(token);
    // if (!authContext || !hasPermission(authContext, 'assets', 'read')) {
    //   return reply.status(403).send({ error: 'Insufficient permissions' });
    // }

    try {
      const assets = await repo.getDataAssets();
      return assets;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data assets' });
    }
  });

  // Get data asset by ID
  app.get('/assets/:id', async (request, reply) => {
    // TODO: Re-enable authentication for production
    // const authHeader = request.headers.authorization;
    // if (!authHeader?.startsWith('Bearer ')) {
    //   return reply.status(401).send({ error: 'Authorization required' });
    // }

    // const token = authHeader.substring(7);
    // const authContext = extractAuthContext(token);
    // if (!authContext || !hasPermission(authContext, 'assets', 'read')) {
    //   return reply.status(403).send({ error: 'Insufficient permissions' });
    // }

    const { id } = request.params as { id: string };

    try {
      const asset = await repo.getDataAssetById(id);
      if (!asset) {
        return reply.status(404).send({ error: 'Data asset not found' });
      }
      return asset;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch data asset' });
    }
  });

  // Create new data asset
  app.post('/assets', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'assets', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = createAssetSchema.parse(request.body);

    try {
      const asset = await repo.createDataAsset(body);

      await repo.logAuditEvent({
        actorUserId: authContext.userId,
        action: 'CREATE_ASSET',
        entityType: 'DATA_ASSET',
        entityId: asset.id,
        newValues: body,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return asset;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to create data asset' });
    }
  });

  // Update data asset
  app.put('/assets/:id', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'assets', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { id } = request.params as { id: string };
    const body = createAssetSchema.partial().parse(request.body);

    try {
      const asset = await repo.updateDataAsset(id, body);

      await repo.logAuditEvent({
        actorUserId: authContext.userId,
        action: 'UPDATE_ASSET',
        entityType: 'DATA_ASSET',
        entityId: id,
        oldValues: { id },
        newValues: body,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return asset;
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to update data asset' });
    }
  });

  // Delete data asset
  app.delete('/assets/:id', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'assets', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { id } = request.params as { id: string };

    try {
      await repo.deleteDataAsset(id);

      await repo.logAuditEvent({
        actorUserId: authContext.userId,
        action: 'DELETE_ASSET',
        entityType: 'DATA_ASSET',
        entityId: id,
        oldValues: { id },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return { success: true };
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete data asset' });
    }
  });
}
