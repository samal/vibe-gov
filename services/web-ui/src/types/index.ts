// API Types
export interface User {
  id: number;
  email: string;
  displayName?: string;
  createdAt: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  roles: Role[];
}

export interface DataAsset {
  id: string;
  name: string;
  namespace: string;
  sourceSystem: string;
  assetType: 'TABLE' | 'VIEW' | 'COLUMN' | 'REPORT';
  schema?: {
    columns?: Array<{
      name: string;
      dataType: string;
      classification?: string;
    }>;
  };
  owners?: string[];
  updatedAt: string;
}

export interface LineageNode {
  id: string;
  name: string;
  type: string;
  namespace: string;
  sourceSystem: string;
}

export interface LineageEdge {
  source: string;
  target: string;
  type: string;
  transformation?: {
    type: string;
    expression?: string;
  };
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
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
  createdAt: string;
}

// UI State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  roles: Role[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LineageState {
  selectedNode: LineageNode | null;
  graph: LineageGraph | null;
  isLoading: boolean;
  error: string | null;
}

export interface CatalogState {
  assets: DataAsset[];
  filteredAssets: DataAsset[];
  searchTerm: string;
  selectedClassifications: string[];
  isLoading: boolean;
  error: string | null;
}

// Component Props
export interface LayoutProps {
  children: React.ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LineageGraphProps {
  data: LineageGraph;
  onNodeClick?: (node: LineageNode) => void;
  onNodeHover?: (node: LineageNode | null) => void;
}

export interface AssetCardProps {
  asset: DataAsset;
  onSelect?: (asset: DataAsset) => void;
}

export interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  classifications: DataClassification[];
  selectedClassifications: string[];
  onClassificationChange: (classifications: string[]) => void;
}
