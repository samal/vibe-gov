import { AssetEvent, LineageEvent } from './types';

export interface ConnectorContext {
  emitAsset: (event: AssetEvent) => Promise<void>;
  emitLineage: (event: LineageEvent) => Promise<void>;
  logger: { info: (msg: unknown) => void; error: (msg: unknown) => void };
}

export interface Connector {
  readonly type: string;
  readonly name: string;
  init?(context: ConnectorContext): Promise<void>;
  discover?(context: ConnectorContext): Promise<void>;
  poll?(context: ConnectorContext): Promise<void>;
  shutdown?(context: ConnectorContext): Promise<void>;
} 