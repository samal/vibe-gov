import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { GovernanceRepository } from '../db/repository.js';
import { extractAuthContext, hasPermission } from '../auth/jwt.js';

const auditFiltersSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  actorUserId: z.number().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  limit: z.number().min(1).max(1000).default(100),
  offset: z.number().min(0).default(0),
});

export async function registerAuditRoutes(app: FastifyInstance) {
  const repo = new GovernanceRepository();

  // Get audit events with filters
  app.get('/audit/events', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'audit', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const query = request.query as Record<string, string>;
    const parsedFilters = auditFiltersSchema.parse({
      ...query,
      actorUserId: query.actorUserId ? Number(query.actorUserId) : undefined,
      limit: query.limit ? Number(query.limit) : 100,
      offset: query.offset ? Number(query.offset) : 0,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    const filters = {
      ...parsedFilters,
      startDate: parsedFilters.startDate ? new Date(parsedFilters.startDate) : undefined,
      endDate: parsedFilters.endDate ? new Date(parsedFilters.endDate) : undefined,
    };

    const events = await repo.getAuditEvents(filters);
    return events;
  });

  // Get audit events for a specific entity
  app.get('/audit/events/entity/:entityType/:entityId', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'audit', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { entityType, entityId } = request.params as { entityType: string; entityId: string };
    const query = request.query as Record<string, string>;
    
    const parsedFilters = auditFiltersSchema.parse({
      entityType,
      entityId,
      limit: query.limit ? Number(query.limit) : 100,
      offset: query.offset ? Number(query.offset) : 0,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    const filters = {
      ...parsedFilters,
      startDate: parsedFilters.startDate ? new Date(parsedFilters.startDate) : undefined,
      endDate: parsedFilters.endDate ? new Date(parsedFilters.endDate) : undefined,
    };

    const events = await repo.getAuditEvents(filters);
    return events;
  });

  // Get audit events for a specific user
  app.get('/audit/events/user/:userId', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'audit', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { userId } = request.params as { userId: string };
    const query = request.query as Record<string, string>;
    
    const parsedFilters = auditFiltersSchema.parse({
      actorUserId: Number(userId),
      limit: query.limit ? Number(query.limit) : 100,
      offset: query.offset ? Number(query.offset) : 0,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    const filters = {
      ...parsedFilters,
      startDate: parsedFilters.startDate ? new Date(parsedFilters.startDate) : undefined,
      endDate: parsedFilters.endDate ? new Date(parsedFilters.endDate) : undefined,
    };

    const events = await repo.getAuditEvents(filters);
    return events;
  });

  // Get audit summary statistics
  app.get('/audit/summary', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'audit', 'read')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const query = request.query as Record<string, string>;
    const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    // Get total events in date range
    const totalEvents = await repo.getAuditEvents({ startDate, endDate, limit: 1 });
    
    // Get events by action type
    const eventsByAction = await repo.getAuditEvents({ startDate, endDate, limit: 1000 });
    const actionCounts = eventsByAction.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get events by entity type
    const entityCounts = eventsByAction.reduce((acc, event) => {
      acc[event.entityType] = (acc[event.entityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { startDate, endDate },
      totalEvents: totalEvents.length,
      actionBreakdown: actionCounts,
      entityBreakdown: entityCounts,
    };
  });

  // Export audit events (admin only)
  app.get('/audit/export', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'audit', 'export')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const query = request.query as Record<string, string>;
    const parsedFilters = auditFiltersSchema.parse({
      ...query,
      actorUserId: query.actorUserId ? Number(query.actorUserId) : undefined,
      limit: 10000, // Max export size
      offset: 0,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    const filters = {
      ...parsedFilters,
      startDate: parsedFilters.startDate ? new Date(parsedFilters.startDate) : undefined,
      endDate: parsedFilters.endDate ? new Date(parsedFilters.endDate) : undefined,
    };

    const events = await repo.getAuditEvents(filters);
    
    // Set response headers for CSV download
    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename="audit_events.csv"');
    
    // Convert to CSV format
    const csvHeaders = 'ID,Actor User ID,Action,Entity Type,Entity ID,Resource Type,Resource ID,IP Address,User Agent,Created At\n';
    const csvRows = events.map(event => 
      `${event.id},${event.actorUserId || ''},"${event.action}","${event.entityType}","${event.entityId}","${event.resourceType || ''}","${event.resourceId || ''}","${event.ipAddress || ''}","${event.userAgent || ''}","${event.createdAt}"`
    ).join('\n');
    
    return csvHeaders + csvRows;
  });
}
