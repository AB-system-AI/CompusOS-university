# @campusos/events

Framework-agnostic shared event foundation for CampusOS services.

## Purpose

`@campusos/events` provides reusable event primitives:

- Typed event envelopes and metadata
- Canonical event naming (`context.aggregate.action.v1`)
- Event factory helpers
- Serialization and validation
- Event registry and versioning utilities

## Installation

```json
{
  "dependencies": {
    "@campusos/events": "workspace:*"
  }
}
```

## Usage

```typescript
import {
  createEvent,
  serializeEvent,
  deserializeEvent,
  registerEvent,
  validateEnvelope,
} from '@campusos/events';

const event = createEvent({
  eventName: 'identity.user.created.v1',
  payload: { userId: 'user-1' },
  producer: 'identity-service',
  tenantId: 'tenant-1',
  correlationId: 'corr-1',
  causationId: 'cause-1',
  traceId: 'trace-1',
});

const json = serializeEvent(event);
const restored = deserializeEvent(json);
```

## Architecture Rules

- Framework-agnostic (no Kafka, NestJS, Prisma)
- No service-specific or business events
- Immutable envelopes
- Fail-fast validation
- Public API only from package root

## License

UNLICENSED — CampusOS Engineering
