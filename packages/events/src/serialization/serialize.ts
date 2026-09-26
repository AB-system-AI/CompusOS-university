import type { EventEnvelope } from '../types/index.js';
import { validateEnvelope } from '../validation/validate-envelope.js';

export function serializeEvent<TPayload>(event: EventEnvelope<TPayload>): string {
  const validated = validateEnvelope(event);
  return JSON.stringify(validated);
}

export function deserializeEvent<TPayload = unknown>(json: string): EventEnvelope<TPayload> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json) as unknown;
  } catch (error) {
    throw new Error('Failed to parse event JSON', { cause: error });
  }
  return validateEnvelope<TPayload>(parsed);
}
