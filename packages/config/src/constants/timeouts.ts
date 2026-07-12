/** Shared timeout defaults in milliseconds unless noted. */
export const TIMEOUTS = {
  HTTP_REQUEST_MS: 30_000,
  HTTP_KEEP_ALIVE_MS: 5_000,
  DB_CONNECT_MS: 10_000,
  DB_QUERY_MS: 30_000,
  REDIS_CONNECT_MS: 5_000,
  KAFKA_CONNECT_MS: 10_000,
  GRACEFUL_SHUTDOWN_MS: 15_000,
  HEALTH_CHECK_MS: 3_000,
} as const;
