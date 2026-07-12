/** Standard HTTP header names used across CampusOS services. */
export const HEADER_NAMES = {
  CORRELATION_ID: 'x-correlation-id',
  REQUEST_ID: 'x-request-id',
  TENANT_ID: 'x-tenant-id',
  IDEMPOTENCY_KEY: 'idempotency-key',
  API_VERSION: 'x-api-version',
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  ACCEPT_LANGUAGE: 'accept-language',
} as const;

/** Primary distributed tracing / correlation header. */
export const CORRELATION_ID_HEADER = HEADER_NAMES.CORRELATION_ID;
