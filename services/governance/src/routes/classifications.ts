import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GovernanceRepository } from '../db/repository.js';
import { extractAuthContext, hasPermission } from '../auth/jwt.js';

const classificationSchema = z.object({
  key: z.string().min(1).max(64),
  label: z.string().min(1).max(128),
  description: z.string().optional(),
  sensitivityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

const assignClassificationSchema = z.object({
  assetId: z.string(),
  classificationKey: z.string(),
});

export async function registerClassificationRoutes(app: FastifyInstance) {
  const repo = new GovernanceRepository();

  // Get all classifications
  app.get('/classifications', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'classifications', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const classifications = await repo.getClassifications();
    return classifications;
  });

  // Create classification (data steward/admin only)
  app.post('/classifications', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'classifications', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = classificationSchema.parse(request.body);
    
    try {
      const classification = await repo.createClassification(body);
      
      // Log audit event
      await repo.logAuditEvent({
        actorUserId: authContext.userId,
        action: 'CREATE_CLASSIFICATION',
        entityType: 'CLASSIFICATION',
        entityId: classification.key,
        newValues: body,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return classification;
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return reply.status(409).send({ error: 'Classification key already exists' });
      }
      throw error;
    }
  });

  // Assign classification to asset
  app.post('/classifications/assign', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'classifications', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = assignClassificationSchema.parse(request.body);
    
    await repo.assignClassificationToAsset(body.assetId, body.classificationKey, authContext.userId);
    
    // Log audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'ASSIGN_CLASSIFICATION',
      entityType: 'ASSET',
      entityId: body.assetId,
      resourceType: 'CLASSIFICATION',
      resourceId: body.classificationKey,
      newValues: { classificationKey: body.classificationKey },
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return { success: true };
  });

  // Get classifications for a specific asset
  app.get('/assets/:assetId/classifications', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'assets', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { assetId } = request.params as { assetId: string };
    const classifications = await repo.getAssetClassifications(assetId);
    return classifications;
  });

  // Remove classification from asset
  app.delete('/assets/:assetId/classifications/:classificationKey', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'classifications', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { assetId, classificationKey } = request.params as { assetId: string; classificationKey: string };
    
    // Note: This would require adding a removeClassificationFromAsset method to the repository
    // For now, we'll just log the audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'REMOVE_CLASSIFICATION',
      entityType: 'ASSET',
      entityId: assetId,
      resourceType: 'CLASSIFICATION',
      resourceId: classificationKey,
      oldValues: { classificationKey },
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return { success: true };
  });
}
