import type { EventEnvelope } from './envelope.js';
import type { AggregateId } from './identifiers.js';

export interface DomainEvent<TPayload = unknown> extends EventEnvelope<TPayload> {
  readonly kind: 'domain';
  readonly aggregateId: AggregateId;
}

export interface IntegrationEvent<TPayload = unknown> extends EventEnvelope<TPayload> {
  readonly kind: 'integration';
}

export interface InternalEvent<TPayload = unknown> extends EventEnvelope<TPayload> {
  readonly kind: 'internal';
}
