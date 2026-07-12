/** Shared operational limits for APIs and infrastructure clients. */
export const LIMITS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 25,
  MAX_REQUEST_BODY_BYTES: 10 * 1024 * 1024,
  MAX_UPLOAD_BYTES: 50 * 1024 * 1024,
  MAX_DB_POOL_SIZE: 50,
  MIN_DB_POOL_SIZE: 2,
  MAX_REDIS_CONNECTIONS: 20,
  MAX_KAFKA_RETRIES: 5,
} as const;
