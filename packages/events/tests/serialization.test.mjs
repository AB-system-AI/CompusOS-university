import { describe, expect, test } from 'bun:test';

import { createEvent, deserializeEvent, serializeEvent } from '../src/index.js';

describe('serialization', () => {
  test('round-trips event envelope', () => {
    const event = createEvent({
      eventName: 'search.index.updated.v1',
      payload: { index: 'courses' },
      producer: 'search-service',
      tenantId: 'tenant-1',
      correlationId: 'corr-1',
      causationId: 'cause-1',
      traceId: 'trace-1',
    });

    const restored = deserializeEvent(serializeEvent(event));
    expect(restored.metadata.eventName).toBe(event.metadata.eventName);
    expect(restored.payload).toEqual(event.payload);
  });
});
