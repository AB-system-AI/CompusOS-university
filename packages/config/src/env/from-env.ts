import { pickEnv } from './pick-env.js';
import type { RawConfigInput } from './raw-config.types.js';
import { readCampusEnvironment, readNodeEnv } from './to-app-input.js';

const ENV_MAPPING = {
  appName: ['CAMPUSOS_APP_NAME', 'APP_NAME'],
  appVersion: ['CAMPUSOS_APP_VERSION', 'APP_VERSION'],
  logLevel: ['CAMPUSOS_LOG_LEVEL', 'LOG_LEVEL'],
  host: ['CAMPUSOS_HOST', 'HOST'],
  port: ['CAMPUSOS_PORT', 'PORT'],
  apiPrefix: ['CAMPUSOS_API_PREFIX', 'API_PREFIX'],
  corsOrigins: ['CAMPUSOS_CORS_ORIGINS', 'CORS_ORIGINS'],
  requestTimeoutMs: ['CAMPUSOS_REQUEST_TIMEOUT', 'REQUEST_TIMEOUT'],
  trustProxy: ['CAMPUSOS_TRUST_PROXY', 'TRUST_PROXY'],
  databaseUrl: ['DATABASE_URL'],
  dbPoolMin: ['DB_POOL_MIN'],
  dbPoolMax: ['DB_POOL_MAX'],
  dbSsl: ['DB_SSL'],
  dbSchema: ['DB_SCHEMA'],
  dbConnectionTimeoutMs: ['DB_CONNECTION_TIMEOUT_MS'],
  redisUrl: ['REDIS_URL'],
  redisTls: ['REDIS_TLS'],
  redisKeyPrefix: ['REDIS_KEY_PREFIX'],
  redisConnectTimeoutMs: ['REDIS_CONNECT_TIMEOUT_MS'],
  kafkaBrokers: ['KAFKA_BROKERS'],
  kafkaClientId: ['KAFKA_CLIENT_ID'],
  kafkaGroupId: ['KAFKA_GROUP_ID'],
  kafkaSsl: ['KAFKA_SSL'],
  kafkaConnectionTimeoutMs: ['KAFKA_CONNECTION_TIMEOUT_MS'],
  jwtSecret: ['JWT_SECRET'],
  jwtPublicKey: ['JWT_PUBLIC_KEY'],
  jwtIssuer: ['JWT_ISSUER'],
  jwtAudience: ['JWT_AUDIENCE'],
  jwtExpiresIn: ['JWT_EXPIRES_IN'],
  awsRegion: ['AWS_REGION'],
  awsAccessKeyId: ['AWS_ACCESS_KEY_ID'],
  awsSecretAccessKey: ['AWS_SECRET_ACCESS_KEY'],
  awsEndpoint: ['AWS_ENDPOINT'],
  serviceName: ['OTEL_SERVICE_NAME', 'CAMPUSOS_SERVICE_NAME'],
  otlpEndpoint: ['OTEL_EXPORTER_OTLP_ENDPOINT'],
  sentryDsn: ['SENTRY_DSN'],
  logFormat: ['CAMPUSOS_LOG_FORMAT', 'LOG_FORMAT'],
  metricsEnabled: ['CAMPUSOS_METRICS_ENABLED', 'METRICS_ENABLED'],
  tracingEnabled: ['CAMPUSOS_TRACING_ENABLED', 'TRACING_ENABLED'],
  aiEnabled: ['AI_ENABLED'],
  aiProvider: ['AI_PROVIDER'],
  aiApiKey: ['AI_API_KEY'],
  aiModel: ['AI_MODEL'],
  aiEndpoint: ['AI_ENDPOINT'],
  aiTimeoutMs: ['AI_TIMEOUT_MS'],
} as const;

export function mapEnvToRawConfig(
  env: NodeJS.ProcessEnv = process.env,
  overrides: Record<string, string | undefined> = {},
): RawConfigInput {
  const merged = { ...env, ...overrides };
  const picked = pickEnv(merged, ENV_MAPPING);

  return {
    nodeEnv: readNodeEnv(merged),
    environment: readCampusEnvironment(merged),
    appVersion: picked.appVersion ?? '0.0.0',
    ...picked,
  };
}
