import type { AppConfig } from '../types/index.js';

import { loadConfig, type LoadConfigOptions } from './config-loader.js';

type EnvSnapshot = Record<string, string | undefined>;

function snapshotEnv(env: NodeJS.ProcessEnv = process.env): EnvSnapshot {
  return { ...env };
}

function restoreEnvValue(env: NodeJS.ProcessEnv, key: string, value: string | undefined): void {
  if (value === undefined) {
    // Required for test isolation when unsetting environment variables.
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- process.env cleanup
    delete env[key];
    return;
  }
  env[key] = value;
}

export function resetEnv(env: NodeJS.ProcessEnv = process.env): void {
  const snapshot = envSnapshotStore.get(env);
  if (!snapshot) return;
  for (const [key, value] of Object.entries(snapshot)) {
    restoreEnvValue(env, key, value);
  }
  for (const key of Object.keys(env)) {
    if (!(key in snapshot)) {
      restoreEnvValue(env, key, undefined);
    }
  }
  envSnapshotStore.delete(env);
}

const envSnapshotStore = new WeakMap<NodeJS.ProcessEnv, EnvSnapshot>();

export function overrideEnv(
  overrides: Record<string, string | undefined>,
  env: NodeJS.ProcessEnv = process.env,
): () => void {
  if (!envSnapshotStore.has(env)) {
    envSnapshotStore.set(env, snapshotEnv(env));
  }
  for (const [key, value] of Object.entries(overrides)) {
    restoreEnvValue(env, key, value);
  }
  return () => {
    resetEnv(env);
  };
}

export function withEnv<T>(
  overrides: Record<string, string | undefined>,
  fn: () => T,
  env: NodeJS.ProcessEnv = process.env,
): T {
  const restore = overrideEnv(overrides, env);
  try {
    return fn();
  } finally {
    restore();
  }
}

export const MOCK_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  CAMPUSOS_ENV: 'test',
  CAMPUSOS_APP_NAME: 'campusos-test',
  CAMPUSOS_APP_VERSION: '0.0.0-test',
  CAMPUSOS_LOG_LEVEL: 'error',
  CAMPUSOS_HOST: '127.0.0.1',
  CAMPUSOS_PORT: '4000',
  CAMPUSOS_API_PREFIX: '/api/v1',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/campusos_test',
  REDIS_URL: 'redis://localhost:6379',
  KAFKA_BROKERS: 'localhost:9092',
  KAFKA_CLIENT_ID: 'campusos-test',
  JWT_SECRET: 'test-jwt-secret-min-16-chars',
  JWT_ISSUER: 'https://auth.campusos.test',
  JWT_AUDIENCE: 'campusos-api',
  OTEL_SERVICE_NAME: 'campusos-test',
  AWS_REGION: 'us-east-1',
};

export function createMockConfig(
  overrides: Record<string, string | undefined> = {},
  options: Omit<LoadConfigOptions, 'overrides'> = {},
): Readonly<AppConfig> {
  return loadConfig({
    ...options,
    overrides: { ...MOCK_ENV, ...overrides },
  });
}

export function mockConfig(
  overrides: Record<string, string | undefined> = {},
): Readonly<AppConfig> {
  return createMockConfig(overrides);
}
