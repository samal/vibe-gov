import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GovernanceRepository } from '../db/repository.js';
import { MaskingEngine } from '../masking/engine.js';
import { extractAuthContext, hasPermission } from '../auth/jwt.js';

const maskingRuleSchema = z.object({
  name: z.string().min(1).max(128),
  classificationKey: z.string().min(1).max(64),
  roleId: z.number(),
  maskingType: z.enum(['REDACT', 'HASH', 'PARTIAL', 'CUSTOM']),
  maskingConfig: z.record(z.unknown()).default({}),
  enabled: z.boolean().default(true),
});

const maskDataSchema = z.object({
  value: z.string(),
  classificationKey: z.string(),
  userRoles: z.array(z.string()),
});

export async function registerMaskingRoutes(app: FastifyInstance) {
  const repo = new GovernanceRepository();
  const maskingEngine = new MaskingEngine();

  // Initialize masking engine with rules
  async function refreshMaskingRules() {
    const rules = await repo.getMaskingRules();
    maskingEngine.setRules(rules);
  }

  // Initialize masking engine on startup
  await refreshMaskingRules();

  // Get all masking rules
  app.get('/masking/rules', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const rules = await repo.getMaskingRules();
    return rules;
  });

  // Create masking rule (admin/data steward only)
  app.post('/masking/rules', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = maskingRuleSchema.parse(request.body);
    
    const rule = await repo.createMaskingRule(body);
    
    // Refresh masking engine
    await refreshMaskingRules();
    
    // Log audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'CREATE_MASKING_RULE',
      entityType: 'MASKING_RULE',
      entityId: rule.id.toString(),
      newValues: body,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return rule;
  });

  // Update masking rule
  app.put('/masking/rules/:id', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'write')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { id } = request.params as { id: string };
    const body = maskingRuleSchema.partial().parse(request.body);
    
    const rule = await repo.updateMaskingRule(Number(id), body);
    
    // Refresh masking engine
    await refreshMaskingRules();
    
    // Log audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'UPDATE_MASKING_RULE',
      entityType: 'MASKING_RULE',
      entityId: id,
      oldValues: { id: Number(id) },
      newValues: body,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return rule;
  });

  // Test data masking
  app.post('/masking/test', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = maskDataSchema.parse(request.body);
    
    // Ensure masking engine has latest rules
    await refreshMaskingRules();
    
    const result = maskingEngine.applyMasking(
      body.value,
      body.classificationKey,
      body.userRoles
    );

    return result;
  });

  // Check if data should be masked
  app.post('/masking/check', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { classificationKey, userRoles } = request.body as { classificationKey: string; userRoles: string[] };
    
    // Ensure masking engine has latest rules
    await refreshMaskingRules();
    
    const shouldMask = maskingEngine.shouldMask(classificationKey, userRoles);

    return { shouldMask };
  });

  // Get masking rules for a specific classification
  app.get('/masking/rules/classification/:classificationKey', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'masking', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { classificationKey } = request.params as { classificationKey: string };
    const rules = await repo.getMaskingRules();
    const filteredRules = rules.filter(rule => rule.classificationKey === classificationKey);
    
    return filteredRules;
  });
}
