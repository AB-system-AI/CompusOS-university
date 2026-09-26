import { describe, expect, test } from 'bun:test';

import { EventValidationError, createEvent, validateEnvelope } from '../src/index.js';

describe('validation', () => {
  test('validates valid envelope', () => {
    const event = createEvent({
      eventName: 'identity.user.created.v1',
      payload: { ok: true },
      producer: 'identity-service',
      tenantId: 'tenant-1',
      correlationId: 'corr-1',
      causationId: 'cause-1',
      traceId: 'trace-1',
    });

    expect(() => validateEnvelope(event)).not.toThrow();
  });

  test('fails fast on invalid envelope', () => {
    expect(() => validateEnvelope({ kind: 'integration' })).toThrow(EventValidationError);
  });

  test('rejects invalid event names', () => {
    expect(() =>
      createEvent({
        eventName: 'InvalidEventName',
        payload: {},
        producer: 'svc',
        tenantId: 'tenant-1',
        correlationId: 'corr-1',
        causationId: 'cause-1',
        traceId: 'trace-1',
      }),
    ).toThrow('Invalid event name');
  });
});
