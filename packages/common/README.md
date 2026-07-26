# @campusos/common

Framework-agnostic shared utilities for CampusOS applications and services.

## Purpose

`@campusos/common` provides reusable primitives used across the monorepo:

- Result pattern for typed success/failure flows
- Standard error hierarchy
- Immutable value objects
- Domain entity base classes
- Utility and functional helpers
- Shared constants

## Installation

```json
{
  "dependencies": {
    "@campusos/common": "workspace:*"
  }
}
```

## Usage

```typescript
import {
  success,
  failure,
  isSuccess,
  ValidationError,
  UUID,
  Email,
  pipe,
  retry,
} from '@campusos/common';

const id = UUID.generate();
const email = Email.create('user@example.com');

if (isSuccess(email)) {
  console.log(email.value.toString());
}

const value = pipe('hello-world', (s) => s.toUpperCase());
```

## Public API

Import only from `@campusos/common`. Deep imports are not supported.

## Architecture Rules

- Framework-agnostic (no NestJS, Express, Fastify, Prisma)
- No service-specific or CampusOS business logic
- Immutable value objects where appropriate
- Max 300 lines per source file (EDS FF-PERF-006)

## License

UNLICENSED — CampusOS Engineering
