import { assertValidEventName } from '../naming/event-name.js';
import type {
  DomainEvent,
  EventEnvelope,
  EventHeaders,
  EventKind,
  EventMetadata,
  IntegrationEvent,
  InternalEvent,
} from '../types/index.js';
import { parseEventVersion } from '../versioning/version.js';

export interface CreateEventInput<TPayload> {
  eventName: string;
  payload: TPayload;
  producer: string;
  tenantId: string;
  correlationId: string;
  causationId: string;
  traceId: string;
  userId?: string;
  aggregateId?: string;
  occurredAt?: string;
  eventId?: string;
  kind?: EventKind;
  schemaVersion?: string;
}

function freezeEnvelope<TPayload>(envelope: EventEnvelope<TPayload>): EventEnvelope<TPayload> {
  return Object.freeze({
    ...envelope,
    metadata: Object.freeze({ ...envelope.metadata }),
    headers: Object.freeze({ ...envelope.headers }),
    payload: envelope.payload,
  });
}

function buildMetadata<TPayload>(input: CreateEventInput<TPayload>): EventMetadata {
  assertValidEventName(input.eventName);
  const eventVersion = parseEventVersion(input.eventName);

  return {
    eventId: input.eventId ?? crypto.randomUUID(),
    eventName: input.eventName,
    eventVersion,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    tenantId: input.tenantId,
    correlationId: input.correlationId,
    causationId: input.causationId,
    traceId: input.traceId,
    producer: input.producer,
    aggregateId: input.aggregateId,
    userId: input.userId,
    schemaVersion: input.schemaVersion,
  };
}

function buildHeaders<TPayload>(input: CreateEventInput<TPayload>): EventHeaders {
  return {
    correlationId: input.correlationId,
    causationId: input.causationId,
    traceId: input.traceId,
    tenantId: input.tenantId,
    userId: input.userId,
  };
}

export function createEvent<TPayload>(input: CreateEventInput<TPayload>): EventEnvelope<TPayload> {
  const kind = input.kind ?? 'integration';
  const metadata = buildMetadata(input);
  const headers = buildHeaders(input);

  if (kind === 'domain') {
    if (!input.aggregateId) {
      throw new Error('aggregateId is required for domain events');
    }
    const domainEvent: DomainEvent<TPayload> = {
      kind: 'domain',
      metadata,
      headers,
      payload: input.payload,
      aggregateId: input.aggregateId,
    };
    return freezeEnvelope(domainEvent);
  }

  if (kind === 'internal') {
    const internalEvent: InternalEvent<TPayload> = {
      kind: 'internal',
      metadata,
      headers,
      payload: input.payload,
    };
    return freezeEnvelope(internalEvent);
  }

  const integrationEvent: IntegrationEvent<TPayload> = {
    kind: 'integration',
    metadata,
    headers,
    payload: input.payload,
  };
  return freezeEnvelope(integrationEvent);
}

export function cloneEvent<TPayload>(event: EventEnvelope<TPayload>): EventEnvelope<TPayload> {
  return freezeEnvelope({
    ...event,
    metadata: { ...event.metadata },
    headers: { ...event.headers },
    payload: event.payload,
  });
}

export function withMetadata<TPayload>(
  event: EventEnvelope<TPayload>,
  metadata: Partial<EventMetadata>,
): EventEnvelope<TPayload> {
  return freezeEnvelope({
    ...event,
    metadata: { ...event.metadata, ...metadata },
  });
}

export function withHeaders<TPayload>(
  event: EventEnvelope<TPayload>,
  headers: Partial<EventHeaders>,
): EventEnvelope<TPayload> {
  return freezeEnvelope({
    ...event,
    headers: { ...event.headers, ...headers },
  });
}
