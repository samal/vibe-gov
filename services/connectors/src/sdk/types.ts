export type AssetType = 'TABLE' | 'VIEW' | 'COLUMN' | 'REPORT';

export interface ColumnSchema {
  name: string;
  dataType: string;
  classification?: string;
}

export interface AssetSchema {
  columns?: ColumnSchema[];
}

export interface AssetEvent {
  assetId: string;
  assetType: AssetType;
  name: string;
  namespace: string;
  sourceSystem: string;
  schema?: AssetSchema;
  owners?: string[];
  updatedAt: string; // ISO-8601
}

export interface LineageEndpointRef {
  assetId: string;
  column?: string;
}

export interface LineageEvent {
  upstream: LineageEndpointRef;
  downstream: LineageEndpointRef;
  transformation?: {
    type: 'SQL' | 'ETL' | 'OTHER';
    expression?: string;
  };
  version?: string;
  observedAt: string; // ISO-8601
} 