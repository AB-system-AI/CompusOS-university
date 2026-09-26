import { DatabaseValidationError } from './errors.js';

export type DatabaseEnvironment = 'development' | 'test' | 'staging' | 'production';
export type DatabaseConnectionConfig = Readonly<{
  url: string;
  connectionTimeoutMs: number;
  queryTimeoutMs: number;
}>;
export type DatabasePoolConfig = Readonly<{
  minConnections: number;
  maxConnections: number;
  idleTimeoutMs: number;
  acquisitionTimeoutMs: number;
}>;
export type RetryConfig = Readonly<{ maxAttempts: number; initialDelayMs: number }>;
export type DatabaseConfig = Readonly<{
  environment: DatabaseEnvironment;
  connection: DatabaseConnectionConfig;
  pool: DatabasePoolConfig;
  retry: RetryConfig;
}>;
export type DatabaseConfigInput = Readonly<{
  environment: DatabaseEnvironment;
  url: string;
  connectionTimeoutMs?: number;
  queryTimeoutMs?: number;
  minConnections?: number;
  maxConnections?: number;
  idleTimeoutMs?: number;
  acquisitionTimeoutMs?: number;
  maxAttempts?: number;
  initialDelayMs?: number;
}>;

const positive = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value <= 0)
    throw new DatabaseValidationError(`Invalid ${field}`, field);
  return value;
};
const validPool = (pool: DatabasePoolConfig): DatabasePoolConfig => {
  if (
    !Number.isInteger(pool.minConnections) ||
    pool.minConnections < 0 ||
    !Number.isInteger(pool.maxConnections) ||
    pool.maxConnections < pool.minConnections
  )
    throw new DatabaseValidationError('Invalid connection pool configuration', 'pool');
  return Object.freeze({
    ...pool,
    idleTimeoutMs: positive(pool.idleTimeoutMs, 'idleTimeoutMs'),
    acquisitionTimeoutMs: positive(pool.acquisitionTimeoutMs, 'acquisitionTimeoutMs'),
  });
};
const validUrl = (url: string): void => {
  let protocol: string;
  try {
    protocol = new URL(url).protocol;
  } catch {
    throw new DatabaseValidationError('Invalid database connection URL', 'url');
  }
  if (!['postgres:', 'postgresql:'].includes(protocol))
    throw new DatabaseValidationError('Database URL must use PostgreSQL', 'url');
};
export function sanitizeConnectionUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}${parsed.pathname}`;
  } catch {
    return '[invalid database URL]';
  }
}
export function createDatabaseConfig(input: DatabaseConfigInput): DatabaseConfig {
  validUrl(input.url);
  const pool = validPool({
    minConnections: input.minConnections ?? 0,
    maxConnections: input.maxConnections ?? 10,
    idleTimeoutMs: input.idleTimeoutMs ?? 30_000,
    acquisitionTimeoutMs: input.acquisitionTimeoutMs ?? 10_000,
  });
  return Object.freeze({
    environment: input.environment,
    connection: Object.freeze({
      url: input.url,
      connectionTimeoutMs: positive(input.connectionTimeoutMs ?? 10_000, 'connectionTimeoutMs'),
      queryTimeoutMs: positive(input.queryTimeoutMs ?? 30_000, 'queryTimeoutMs'),
    }),
    pool,
    retry: Object.freeze({
      maxAttempts: positive(input.maxAttempts ?? 3, 'maxAttempts'),
      initialDelayMs: positive(input.initialDelayMs ?? 100, 'initialDelayMs'),
    }),
  });
}
