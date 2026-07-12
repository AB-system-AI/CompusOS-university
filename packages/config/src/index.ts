// Constants
export {
  CONFIG_SCHEMA_VERSION,
  CORRELATION_ID_HEADER,
  DEFAULT_PORTS,
  ENVIRONMENTS,
  HEADER_NAMES,
  LIMITS,
  NODE_ENVIRONMENTS,
  PACKAGE_VERSION,
  TIMEOUTS,
  type EnvironmentName,
} from './constants/index.js';

// Environment helpers
export {
  getEnvironment,
  isDevelopment,
  isEnvironment,
  isLocal,
  isProduction,
  isStaging,
  isTest,
  mapEnvToRawConfig,
  rawConfigToAppInput,
  type RawConfigInput,
} from './env/index.js';

// Validation
export {
  ConfigValidationError,
  validateConfig,
  validateConfigOrThrow,
} from './validation/index.js';

// Schemas
export {
  aiSchema,
  appConfigSchema,
  awsSchema,
  baseSchema,
  databaseSchema,
  jwtSchema,
  kafkaSchema,
  observabilitySchema,
  redisSchema,
  serverSchema,
  type AiSchemaOutput,
  type AppConfigSchemaOutput,
  type AwsSchemaOutput,
  type BaseSchemaOutput,
  type DatabaseSchemaOutput,
  type JwtSchemaOutput,
  type KafkaSchemaOutput,
  type ObservabilitySchemaOutput,
  type RedisSchemaOutput,
  type ServerSchemaOutput,
} from './schemas/index.js';

// Types
export type {
  AiConfig,
  AppConfig,
  AuthConfig,
  AwsConfig,
  BaseConfig,
  DatabaseConfig,
  Environment,
  KafkaConfig,
  ObservabilityConfig,
  RedisConfig,
  ServerConfig,
} from './types/index.js';

// Utilities
export { parseBoolean, parseCsv, parseDuration, parseNumber, parseSafeUrl } from './utils/index.js';

// Loaders
export {
  MOCK_ENV,
  createMockConfig,
  loadConfig,
  loadPartialConfig,
  mockConfig,
  overrideEnv,
  resetEnv,
  withEnv,
  type LoadConfigOptions,
} from './loaders/index.js';
