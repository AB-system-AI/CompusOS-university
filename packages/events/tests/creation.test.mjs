import { describe, expect, test } from 'bun:test';

import { createEvent } from '../src/index.js';

describe('event creation', () => {
  test('creates integration event with required metadata', () => {
    const event = createEvent({
      eventName: 'identity.user.created.v1',
      payload: { userId: 'user-1' },
      producer: 'identity-service',
      tenantId: 'tenant-1',
      correlationId: 'corr-1',
      causationId: 'cause-1',
      traceId: 'trace-1',
    });

    expect(event.kind).toBe('integration');
    expect(event.metadata.eventName).toBe('identity.user.created.v1');
    expect(event.metadata.eventVersion).toBe(1);
    expect(event.metadata.producer).toBe('identity-service');
    expect(Object.isFrozen(event)).toBe(true);
  });

  test('requires aggregateId for domain events', () => {
    expect(() =>
      createEvent({
        eventName: 'tenant.tenant.created.v1',
        payload: {},
        producer: 'tenant-service',
        tenantId: 'tenant-1',
        correlationId: 'corr-1',
        causationId: 'cause-1',
        traceId: 'trace-1',
        kind: 'domain',
      }),
    ).toThrow('aggregateId is required for domain events');
  });
});
