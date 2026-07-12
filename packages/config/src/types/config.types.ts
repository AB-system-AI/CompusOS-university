import type { EnvironmentName } from '../constants/environments.js';

export type Environment = EnvironmentName;

export interface BaseConfig {
  nodeEnv: 'development' | 'test' | 'production';
  environment: Environment;
  appName: string;
  appVersion: string;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
}

export interface ServerConfig {
  host: string;
  port: number;
  apiPrefix: string;
  corsOrigins: string[];
  requestTimeoutMs: number;
  trustProxy: boolean;
}

export interface DatabaseConfig {
  url: string;
  poolMin: number;
  poolMax: number;
  ssl: boolean;
  schema?: string;
  connectionTimeoutMs: number;
}

export interface RedisConfig {
  url: string;
  tls: boolean;
  keyPrefix: string;
  connectTimeoutMs: number;
}

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  groupId?: string;
  ssl: boolean;
  connectionTimeoutMs: number;
}

export interface AuthConfig {
  jwtSecret?: string;
  jwtPublicKey?: string;
  jwtIssuer: string;
  jwtAudience: string;
  jwtExpiresIn: string;
}

export interface AwsConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

export interface ObservabilityConfig {
  serviceName: string;
  otlpEndpoint?: string;
  sentryDsn?: string;
  logFormat: 'json' | 'pretty';
  metricsEnabled: boolean;
  tracingEnabled: boolean;
}

export interface AiConfig {
  enabled: boolean;
  provider?: string;
  apiKey?: string;
  model?: string;
  endpoint?: string;
  timeoutMs: number;
}

export interface AppConfig {
  base: BaseConfig;
  server: ServerConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  kafka: KafkaConfig;
  auth: AuthConfig;
  aws: AwsConfig;
  observability: ObservabilityConfig;
  ai: AiConfig;
}
