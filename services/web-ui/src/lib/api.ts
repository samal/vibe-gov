import axios from 'axios';
import { 
  LoginResponse, 
  User, 
  Role, 
  DataAsset, 
  LineageGraph, 
  DataClassification, 
  MaskingRule, 
  AuditEvent 
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data;
  },

  createUser: async (userData: { email: string; displayName?: string; password: string; roles?: number[] }): Promise<User> => {
    const response = await api.post('/auth/users', userData);
    return response.data;
  },
};

// Lineage API
export const lineageAPI = {
  parseLineage: async (sql: string, downstream?: string, persist?: boolean): Promise<{ upstreamAssets: string[] }> => {
    const response = await axios.post('/lineage-api/lineage/parse', { sql, downstream, persist });
    return response.data;
  },

  getLineageGraph: async (assetId?: string): Promise<LineageGraph> => {
    const params = assetId ? { assetId } : {};
    const response = await axios.get('/lineage-api/lineage/graph', { params });
    return response.data;
  },
};

// Governance API
export const governanceAPI = {
  // Classifications
  getClassifications: async (): Promise<DataClassification[]> => {
    const response = await api.get('/classifications');
    return response.data;
  },

  createClassification: async (classification: { key: string; label: string; description?: string }): Promise<DataClassification> => {
    const response = await api.post('/classifications', classification);
    return response.data;
  },

  assignClassification: async (assetId: string, classificationKey: string): Promise<void> => {
    await api.post('/classifications/assign', { assetId, classificationKey });
  },

  // Masking Rules
  getMaskingRules: async (): Promise<MaskingRule[]> => {
    const response = await api.get('/masking/rules');
    return response.data;
  },

  createMaskingRule: async (rule: {
    name: string;
    classificationKey: string;
    roleId: number;
    maskingType: 'REDACT' | 'HASH' | 'PARTIAL' | 'CUSTOM';
    maskingConfig?: Record<string, unknown>;
    enabled?: boolean;
  }): Promise<MaskingRule> => {
    const response = await api.post('/masking/rules', rule);
    return response.data;
  },

  testMasking: async (value: string, classificationKey: string, userRoles: string[]): Promise<{ masked: boolean; value: string; reason?: string }> => {
    const response = await api.post('/masking/test', { value, classificationKey, userRoles });
    return response.data;
  },

  // Audit
  getAuditEvents: async (filters?: {
    entityType?: string;
    entityId?: string;
    actorUserId?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditEvent[]> => {
    const response = await api.get('/audit/events', { params: filters });
    return response.data;
  },

  getAuditSummary: async (startDate?: string, endDate?: string): Promise<{
    period: { startDate: string; endDate: string };
    totalEvents: number;
    actionBreakdown: Record<string, number>;
    entityBreakdown: Record<string, number>;
  }> => {
    const response = await api.get('/audit/summary', { params: { startDate, endDate } });
    return response.data;
  },
};

// Assets API
export const assetsAPI = {
  getAssets: async (): Promise<DataAsset[]> => {
    const response = await api.get('/assets');
    return response.data;
  },

  getAssetById: async (id: string): Promise<DataAsset> => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  createAsset: async (asset: Omit<DataAsset, 'id' | 'updatedAt'>): Promise<DataAsset> => {
    const response = await api.post('/assets', asset);
    return response.data;
  },

  updateAsset: async (id: string, updates: Partial<DataAsset>): Promise<DataAsset> => {
    const response = await api.put(`/assets/${id}`, updates);
    return response.data;
  },

  deleteAsset: async (id: string): Promise<void> => {
    await api.delete(`/assets/${id}`);
  },
};
