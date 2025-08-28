export interface User {
  id: number;
  externalId?: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface DataClassification {
  id: number;
  key: string;
  label: string;
  description?: string;
  sensitivityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MaskingRule {
  id: number;
  name: string;
  classificationKey: string;
  roleId: number;
  maskingType: 'REDACT' | 'HASH' | 'PARTIAL' | 'CUSTOM';
  maskingConfig: Record<string, unknown>;
  enabled: boolean;
}

export interface AuditEvent {
  id: number;
  actorUserId?: number;
  action: string;
  entityType: string;
  entityId: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AuthContext {
  userId: number;
  roles: string[];
  permissions: Permission[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  roles: Role[];
}
