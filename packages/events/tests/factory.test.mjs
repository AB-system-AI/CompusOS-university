import { describe, expect, test } from 'bun:test';

import { cloneEvent, createEvent, withHeaders, withMetadata } from '../src/index.js';

const baseInput = {
  eventName: 'identity.user.created.v1',
  payload: { userId: 'user-1' },
  producer: 'identity-service',
  tenantId: 'tenant-1',
  correlationId: 'corr-1',
  causationId: 'cause-1',
  traceId: 'trace-1',
};

describe('factory helpers', () => {
  test('cloneEvent creates independent copy', () => {
    const original = createEvent(baseInput);
    const cloned = cloneEvent(original);
    expect(cloned.metadata.eventId).toBe(original.metadata.eventId);
    expect(cloned).not.toBe(original);
  });

  test('withMetadata and withHeaders merge values', () => {
    const event = createEvent(baseInput);
    const withMeta = withMetadata(event, { producer: 'identity-service-v2' });
    const withHdrs = withHeaders(event, { correlationId: 'corr-2' });

    expect(withMeta.metadata.producer).toBe('identity-service-v2');
    expect(withHdrs.headers.correlationId).toBe('corr-2');
  });
});
