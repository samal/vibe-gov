import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { GovernanceRepository } from '../db/repository.js';
import { generateToken, hasPermission } from '../auth/jwt.js';
import { extractAuthContext } from '../auth/jwt.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  password: z.string().min(6),
  roles: z.array(z.number()).optional(),
});

const assignRoleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  const repo = new GovernanceRepository();

  // Login endpoint
  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    
    const user = await repo.getUserByEmail(body.email);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // For demo purposes, accept any password for existing users
    // In production, you'd verify against stored password hash
    const roles = await repo.getUserRoles(user.id);
    const roleNames = roles.map(r => r.name);
    
    // Generate permissions based on roles
    const permissions = generatePermissionsFromRoles(roleNames);
    
    const token = generateToken(user, roleNames, permissions);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
      roles: roles.map(r => ({ id: r.id, name: r.name, description: r.description })),
    };
  });

  // Create user (admin only)
  app.post('/auth/users', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'users', 'create')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const body = createUserSchema.parse(request.body);
    
    // Check if user already exists
    const existingUser = await repo.getUserByEmail(body.email);
    if (existingUser) {
      return reply.status(409).send({ error: 'User already exists' });
    }

    // Create user
    const newUser = await repo.createUser({
      email: body.email,
      displayName: body.displayName,
    });

    // Assign roles if provided
    if (body.roles) {
      for (const roleId of body.roles) {
        await repo.assignRoleToUser(newUser.id, roleId);
      }
    }

    // Log audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'CREATE_USER',
      entityType: 'USER',
      entityId: newUser.id.toString(),
      newValues: { email: body.email, displayName: body.displayName },
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      createdAt: newUser.createdAt,
    };
  });

  // Assign role to user (admin only)
  app.post('/auth/users/:userId/roles', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const authContext = extractAuthContext(token);
    if (!authContext || !hasPermission(authContext, 'users', 'update')) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }

    const { userId } = request.params as { userId: string };
    const body = assignRoleSchema.parse(request.body);
    
    await repo.assignRoleToUser(Number(userId), body.roleId);

    // Log audit event
    await repo.logAuditEvent({
      actorUserId: authContext.userId,
      action: 'ASSIGN_ROLE',
      entityType: 'USER',
      entityId: userId,
      resourceType: 'ROLE',
      resourceId: body.roleId.toString(),
      newValues: { roleId: body.roleId },
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return { success: true };
  });

  // Get user roles
  app.get('/auth/users/:userId/roles', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const roles = await repo.getUserRoles(Number(userId));
    return roles;
  });

  // Get all roles
  app.get('/auth/roles', async (request, reply) => {
    const roles = await repo.getRoles();
    return roles;
  });
}

function generatePermissionsFromRoles(roles: string[]): string[] {
  const permissions: string[] = [];
  
  for (const role of roles) {
    switch (role) {
      case 'ADMIN':
        permissions.push('*:*'); // All permissions
        break;
      case 'DATA_STEWARD':
        permissions.push('assets:read', 'assets:write', 'classifications:read', 'classifications:write', 'audit:read');
        break;
      case 'ANALYST':
        permissions.push('assets:read', 'lineage:read', 'catalog:read');
        break;
      case 'VIEWER':
        permissions.push('assets:read', 'lineage:read');
        break;
    }
  }
  
  return permissions;
}
