import { z } from 'zod';

import { ENVIRONMENTS } from '../constants/environments.js';
import { LIMITS } from '../constants/limits.js';
import { DEFAULT_PORTS } from '../constants/ports.js';
import { TIMEOUTS } from '../constants/timeouts.js';

export const baseSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  environment: z.enum(ENVIRONMENTS).default('development'),
  appName: z.string().min(1),
  appVersion: z.string().default('0.0.0'),
  logLevel: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type BaseSchemaOutput = z.infer<typeof baseSchema>;

export const serverSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.number().int().min(1).max(65_535).default(DEFAULT_PORTS.API_GATEWAY),
  apiPrefix: z.string().default('/api/v1'),
  corsOrigins: z.array(z.string()).default([]),
  requestTimeoutMs: z.number().int().positive().default(TIMEOUTS.HTTP_REQUEST_MS),
  trustProxy: z.boolean().default(false),
});

export type ServerSchemaOutput = z.infer<typeof serverSchema>;

export const databaseSchema = z.object({
  url: z.url(),
  poolMin: z.number().int().min(0).default(LIMITS.MIN_DB_POOL_SIZE),
  poolMax: z.number().int().positive().default(LIMITS.MAX_DB_POOL_SIZE),
  ssl: z.boolean().default(false),
  schema: z.string().optional(),
  connectionTimeoutMs: z.number().int().positive().default(TIMEOUTS.DB_CONNECT_MS),
});

export type DatabaseSchemaOutput = z.infer<typeof databaseSchema>;

export const redisSchema = z.object({
  url: z.url(),
  tls: z.boolean().default(false),
  keyPrefix: z.string().default('campusos'),
  connectTimeoutMs: z.number().int().positive().default(TIMEOUTS.REDIS_CONNECT_MS),
});

export type RedisSchemaOutput = z.infer<typeof redisSchema>;

export const kafkaSchema = z.object({
  brokers: z.array(z.string().min(1)).min(1),
  clientId: z.string().min(1),
  groupId: z.string().optional(),
  ssl: z.boolean().default(false),
  connectionTimeoutMs: z.number().int().positive().default(TIMEOUTS.KAFKA_CONNECT_MS),
});

export type KafkaSchemaOutput = z.infer<typeof kafkaSchema>;

export const jwtSchema = z
  .object({
    jwtSecret: z.string().min(16).optional(),
    jwtPublicKey: z.string().min(1).optional(),
    jwtIssuer: z.union([z.url(), z.string().min(1)]),
    jwtAudience: z.string().min(1),
    jwtExpiresIn: z.string().default('15m'),
  })
  .refine((value) => Boolean(value.jwtSecret || value.jwtPublicKey), {
    message: 'Either JWT_SECRET or JWT_PUBLIC_KEY must be provided',
    path: ['jwtSecret'],
  });

export type JwtSchemaOutput = z.infer<typeof jwtSchema>;

export const awsSchema = z.object({
  region: z.string().min(1).default('us-east-1'),
  accessKeyId: z.string().optional(),
  secretAccessKey: z.string().optional(),
  endpoint: z.url().optional(),
});

export type AwsSchemaOutput = z.infer<typeof awsSchema>;

export const observabilitySchema = z.object({
  serviceName: z.string().min(1),
  otlpEndpoint: z.url().optional(),
  sentryDsn: z.url().optional(),
  logFormat: z.enum(['json', 'pretty']).default('json'),
  metricsEnabled: z.boolean().default(true),
  tracingEnabled: z.boolean().default(true),
});

export type ObservabilitySchemaOutput = z.infer<typeof observabilitySchema>;

export const aiSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.string().optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  endpoint: z.url().optional(),
  timeoutMs: z.number().int().positive().default(TIMEOUTS.HTTP_REQUEST_MS),
});

export type AiSchemaOutput = z.infer<typeof aiSchema>;

export const appConfigSchema = z.object({
  base: baseSchema,
  server: serverSchema,
  database: databaseSchema,
  redis: redisSchema,
  kafka: kafkaSchema,
  auth: jwtSchema,
  aws: awsSchema,
  observability: observabilitySchema,
  ai: aiSchema,
});

export type AppConfigSchemaOutput = z.infer<typeof appConfigSchema>;
