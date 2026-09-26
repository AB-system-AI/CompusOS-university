export const DEFAULT_SCHEMA_VERSION = '1.0.0' as const;

export const REQUIRED_ENVELOPE_FIELDS = [
  'eventId',
  'eventName',
  'eventVersion',
  'occurredAt',
  'tenantId',
  'correlationId',
  'causationId',
  'traceId',
  'producer',
  'payload',
] as const;
