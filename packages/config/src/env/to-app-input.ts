import { getEnvironment } from '../utils/environment.js';
import { parseBoolean, parseCsv, parseDuration, parseNumber } from '../utils/parsers.js';

import type { RawConfigInput } from './raw-config.types.js';

export function rawConfigToAppInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    base: buildBaseInput(raw),
    server: buildServerInput(raw),
    database: buildDatabaseInput(raw),
    redis: buildRedisInput(raw),
    kafka: buildKafkaInput(raw),
    auth: buildAuthInput(raw),
    aws: buildAwsInput(raw),
    observability: buildObservabilityInput(raw),
    ai: buildAiInput(raw),
  };
}

function buildBaseInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    nodeEnv: raw.nodeEnv,
    environment: raw.environment,
    appName: raw.appName,
    appVersion: raw.appVersion,
    logLevel: raw.logLevel,
  };
}

function buildServerInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    host: raw.host,
    port: raw.port ? parseNumber(raw.port) : undefined,
    apiPrefix: raw.apiPrefix,
    corsOrigins: parseCsv(raw.corsOrigins),
    requestTimeoutMs: raw.requestTimeoutMs ? parseDuration(raw.requestTimeoutMs) : undefined,
    trustProxy: raw.trustProxy ? parseBoolean(raw.trustProxy) : undefined,
  };
}

function buildDatabaseInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    url: raw.databaseUrl,
    poolMin: raw.dbPoolMin ? parseNumber(raw.dbPoolMin) : undefined,
    poolMax: raw.dbPoolMax ? parseNumber(raw.dbPoolMax) : undefined,
    ssl: raw.dbSsl ? parseBoolean(raw.dbSsl) : undefined,
    schema: raw.dbSchema,
    connectionTimeoutMs: raw.dbConnectionTimeoutMs
      ? parseDuration(raw.dbConnectionTimeoutMs)
      : undefined,
  };
}

function buildRedisInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    url: raw.redisUrl,
    tls: raw.redisTls ? parseBoolean(raw.redisTls) : undefined,
    keyPrefix: raw.redisKeyPrefix,
    connectTimeoutMs: raw.redisConnectTimeoutMs
      ? parseDuration(raw.redisConnectTimeoutMs)
      : undefined,
  };
}

function buildKafkaInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    brokers: parseCsv(raw.kafkaBrokers),
    clientId: raw.kafkaClientId,
    groupId: raw.kafkaGroupId,
    ssl: raw.kafkaSsl ? parseBoolean(raw.kafkaSsl) : undefined,
    connectionTimeoutMs: raw.kafkaConnectionTimeoutMs
      ? parseDuration(raw.kafkaConnectionTimeoutMs)
      : undefined,
  };
}

function buildAuthInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    jwtSecret: raw.jwtSecret,
    jwtPublicKey: raw.jwtPublicKey,
    jwtIssuer: raw.jwtIssuer,
    jwtAudience: raw.jwtAudience,
    jwtExpiresIn: raw.jwtExpiresIn,
  };
}

function buildAwsInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    region: raw.awsRegion,
    accessKeyId: raw.awsAccessKeyId,
    secretAccessKey: raw.awsSecretAccessKey,
    endpoint: raw.awsEndpoint,
  };
}

function buildObservabilityInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    serviceName: raw.serviceName,
    otlpEndpoint: raw.otlpEndpoint,
    sentryDsn: raw.sentryDsn,
    logFormat: raw.logFormat,
    metricsEnabled: raw.metricsEnabled ? parseBoolean(raw.metricsEnabled) : undefined,
    tracingEnabled: raw.tracingEnabled ? parseBoolean(raw.tracingEnabled) : undefined,
  };
}

function buildAiInput(raw: RawConfigInput): Record<string, unknown> {
  return {
    enabled: raw.aiEnabled ? parseBoolean(raw.aiEnabled) : undefined,
    provider: raw.aiProvider,
    apiKey: raw.aiApiKey,
    model: raw.aiModel,
    endpoint: raw.aiEndpoint,
    timeoutMs: raw.aiTimeoutMs ? parseDuration(raw.aiTimeoutMs) : undefined,
  };
}

export function readNodeEnv(env: NodeJS.ProcessEnv): 'development' | 'test' | 'production' {
  const value = env.NODE_ENV ?? 'development';
  if (value === 'development' || value === 'test' || value === 'production') {
    return value;
  }
  return 'development';
}

export function readCampusEnvironment(env: NodeJS.ProcessEnv): ReturnType<typeof getEnvironment> {
  return getEnvironment(env);
}
