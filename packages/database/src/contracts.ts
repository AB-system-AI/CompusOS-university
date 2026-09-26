import { type DatabaseConfig } from './config.js';
import { type QueryOptions, type QueryResult } from './query.js';

export type DatabaseResult<T> = QueryResult<T>;
export type DatabaseStatus = 'disconnected' | 'connecting' | 'connected' | 'unhealthy';
export type DatabaseHealth = Readonly<{
  status: DatabaseStatus;
  ready: boolean;
  latencyMs?: number;
}>;
export interface DatabaseTransaction {
  readonly active: boolean;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
export interface DatabaseConnection {
  query<T>(query: string, parameters?: readonly unknown[]): Promise<DatabaseResult<T>>;
  beginTransaction(): Promise<DatabaseTransaction>;
}
export interface DatabaseDriver extends DatabaseConnection {
  readonly config: DatabaseConfig;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<DatabaseHealth>;
  isConnected(): boolean;
}
export interface Repository<T, Id> {
  findById(id: Id): Promise<T | undefined>;
  findOne(options: QueryOptions): Promise<T | undefined>;
  findMany(options?: QueryOptions): Promise<readonly T[]>;
  create(entity: T): Promise<T>;
  update(id: Id, update: Partial<T>): Promise<T>;
  delete(id: Id): Promise<void>;
  exists(id: Id): Promise<boolean>;
  count(options?: QueryOptions): Promise<number>;
}
export interface UnitOfWork {
  readonly transaction: DatabaseTransaction;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
