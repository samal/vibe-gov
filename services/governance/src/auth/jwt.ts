import jwt from 'jsonwebtoken';
import { AuthContext, User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'lineage-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
}

export function generateToken(user: User, roles: string[], permissions: string[]): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    roles,
    permissions,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function extractAuthContext(token: string): AuthContext | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    roles: payload.roles,
    permissions: payload.permissions.map(p => {
      const [resource, action] = p.split(':');
      return { resource, action };
    }),
  };
}

export function hasPermission(authContext: AuthContext, resource: string, action: string): boolean {
  return authContext.permissions.some(p => 
    (p.resource === resource || p.resource === '*') && 
    (p.action === action || p.action === '*')
  );
}

export function hasRole(authContext: AuthContext, role: string): boolean {
  return authContext.roles.includes(role);
}
