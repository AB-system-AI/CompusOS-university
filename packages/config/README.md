# @campusos/config

Enterprise configuration package for CampusOS applications and services.

## Purpose

`@campusos/config` provides typed, validated, immutable configuration loaded from environment
variables. Every service and application in the monorepo should use this package instead of reading
`process.env` directly.

## Installation

This package is a workspace dependency:

```json
{
  "dependencies": {
    "@campusos/config": "workspace:*"
  }
}
```

## Usage

### Load full application configuration

```typescript
import { loadConfig } from '@campusos/config';

const config = loadConfig();
console.log(config.server.port);
console.log(config.database.url);
```

### Environment detection

```typescript
import { getEnvironment, isDevelopment, isProduction } from '@campusos/config';

if (isProduction()) {
  // production-only behavior
}

const env = getEnvironment();
```

### Validate a partial schema

```typescript
import { databaseSchema, validateConfig } from '@campusos/config';

const database = validateConfig(databaseSchema, {
  url: process.env.DATABASE_URL,
});
```

### Testing helpers

```typescript
import { createMockConfig, withEnv } from '@campusos/config';

const config = createMockConfig({ CAMPUSOS_PORT: '5001' });

withEnv({ CAMPUSOS_ENV: 'test' }, () => {
  const testConfig = loadConfig();
});
```

## Environment Variables

| Variable                        | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `CAMPUSOS_ENV`                  | `development`, `test`, `staging`, `production`, `local` |
| `NODE_ENV`                      | Node runtime environment                                |
| `CAMPUSOS_APP_NAME`             | Application name (required)                             |
| `DATABASE_URL`                  | PostgreSQL connection URL (required)                    |
| `REDIS_URL`                     | Redis connection URL (required)                         |
| `KAFKA_BROKERS`                 | Comma-separated Kafka brokers (required)                |
| `KAFKA_CLIENT_ID`               | Kafka client identifier (required)                      |
| `JWT_SECRET` / `JWT_PUBLIC_KEY` | Auth signing material (one required)                    |
| `JWT_ISSUER`                    | Token issuer (required)                                 |
| `JWT_AUDIENCE`                  | Token audience (required)                               |
| `OTEL_SERVICE_NAME`             | Observability service name (required)                   |
| `AWS_REGION`                    | AWS region (default: `us-east-1`)                       |
| `AI_ENABLED`                    | Enable AI integrations (default: `false`)               |

See schema modules in `src/schemas/` for the complete list of supported variables.

## Public API

All exports are available from the package root:

- **Constants** — `ENVIRONMENTS`, `DEFAULT_PORTS`, `TIMEOUTS`, `LIMITS`, `HEADER_NAMES`, `CORRELATION_ID_HEADER`
- **Types** — `AppConfig`, `DatabaseConfig`, `RedisConfig`, `KafkaConfig`, `AuthConfig`, `AwsConfig`, `ObservabilityConfig`, `AiConfig`, `Environment`
- **Schemas** — `baseSchema`, `serverSchema`, `databaseSchema`, `redisSchema`, `kafkaSchema`, `jwtSchema`, `awsSchema`, `observabilitySchema`, `aiSchema`, `appConfigSchema`
- **Validation** — `validateConfig`, `ConfigValidationError`
- **Loaders** — `loadConfig`, `loadPartialConfig`, `createMockConfig`, `mockConfig`, `withEnv`, `overrideEnv`, `resetEnv`
- **Utilities** — `parseBoolean`, `parseNumber`, `parseDuration`, `parseSafeUrl`, `parseCsv`
- **Environment** — `getEnvironment`, `isDevelopment`, `isTest`, `isStaging`, `isProduction`, `isLocal`

Deep imports are not supported. Import only from `@campusos/config`.

## Adding New Configuration Values

1. Add the typed field to `src/types/config.types.ts`.
2. Add Zod validation in the appropriate schema under `src/schemas/`.
3. Map the environment variable in `src/env/from-env.ts`.
4. Export the schema/type from `src/index.ts` if new.
5. Add tests under `src/**/*.test.ts`.
6. Document the variable in this README.

## Architecture Rules

- Framework-agnostic (no NestJS, Express, Fastify, or Prisma)
- No service-specific configuration
- No global mutable configuration state
- Validation fails fast via Zod
- Loaded configuration objects are frozen (immutable)

## License

UNLICENSED — CampusOS Engineering
