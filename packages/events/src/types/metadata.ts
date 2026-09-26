import type { EventName, EventVersion } from './event-name.js';
import type {
  AggregateId,
  CausationId,
  CorrelationId,
  EventId,
  TenantId,
  TraceId,
  UserId,
} from './identifiers.js';

export interface EventMetadata {
  readonly eventId: EventId;
  readonly eventName: EventName;
  readonly eventVersion: EventVersion;
  readonly occurredAt: string;
  readonly tenantId: TenantId;
  readonly correlationId: CorrelationId;
  readonly causationId: CausationId;
  readonly traceId: TraceId;
  readonly producer: string;
  readonly aggregateId?: AggregateId;
  readonly userId?: UserId;
  readonly schemaVersion?: string;
}
