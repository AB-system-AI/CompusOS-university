import { isValidEventName } from '../naming/event-name.js';
import { isNonEmptyString } from '../types/identifiers.js';
import type { EventEnvelope, EventKind } from '../types/index.js';

import { EventValidationError } from './errors.js';

const EVENT_KINDS = new Set<EventKind>(['domain', 'integration', 'internal']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateHeaders(value: unknown, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push('headers: must be an object');
    return;
  }
  const required = ['correlationId', 'causationId', 'traceId', 'tenantId'] as const;
  for (const field of required) {
    if (!isNonEmptyString(value[field])) {
      issues.push(`headers.${field}: must be a non-empty string`);
    }
  }
  if (value.userId !== undefined && !isNonEmptyString(value.userId)) {
    issues.push('headers.userId: must be a non-empty string when provided');
  }
}

function validateRequiredMetadataField(
  value: Record<string, unknown>,
  field: string,
  issues: string[],
): void {
  if (value[field] === undefined || value[field] === null || value[field] === '') {
    issues.push(`metadata.${field}: is required`);
  }
}

function validateMetadataShape(value: unknown, issues: string[]): void {
  if (!isRecord(value)) {
    issues.push('metadata: must be an object');
    return;
  }

  const required = [
    'eventId',
    'eventName',
    'eventVersion',
    'occurredAt',
    'tenantId',
    'correlationId',
    'causationId',
    'traceId',
    'producer',
  ] as const;

  for (const field of required) {
    validateRequiredMetadataField(value, field, issues);
  }

  if (isNonEmptyString(value.eventName) && !isValidEventName(value.eventName)) {
    issues.push('metadata.eventName: invalid canonical event name');
  }

  if (typeof value.eventVersion !== 'number' || !Number.isInteger(value.eventVersion)) {
    issues.push('metadata.eventVersion: must be an integer');
  }

  if (isNonEmptyString(value.occurredAt) && Number.isNaN(Date.parse(value.occurredAt))) {
    issues.push('metadata.occurredAt: must be a valid ISO timestamp');
  }
}

export function validateEnvelope<TPayload = unknown>(input: unknown): EventEnvelope<TPayload> {
  const issues: string[] = [];

  if (!isRecord(input)) {
    throw new EventValidationError('Event envelope validation failed', [
      'envelope: must be an object',
    ]);
  }

  if (!isNonEmptyString(input.kind) || !EVENT_KINDS.has(input.kind as EventKind)) {
    issues.push('kind: must be domain, integration, or internal');
  }

  validateMetadataShape(input.metadata, issues);
  validateHeaders(input.headers, issues);

  if (!('payload' in input)) {
    issues.push('payload: is required');
  }

  if (input.kind === 'domain' && !isNonEmptyString(input.aggregateId)) {
    issues.push('aggregateId: required for domain events');
  }

  if (issues.length > 0) {
    throw new EventValidationError('Event envelope validation failed', issues);
  }

  return input as unknown as EventEnvelope<TPayload>;
}
