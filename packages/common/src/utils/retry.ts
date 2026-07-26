import { LIMITS } from '../constants/limits.js';

export function sleep(ms: number): Promise<void> {
  if (ms < 0) {
    return Promise.reject(new Error('Sleep duration must be non-negative'));
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
  backoffFactor?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

interface ResolvedRetryOptions {
  attempts: number;
  delayMs: number;
  backoffFactor: number;
  maxDelayMs: number;
  shouldRetry: (error: unknown, attempt: number) => boolean;
}

function resolveRetryOptions(options: RetryOptions): ResolvedRetryOptions {
  return {
    attempts: options.attempts ?? LIMITS.MAX_RETRY_ATTEMPTS,
    delayMs: options.delayMs ?? LIMITS.DEFAULT_RETRY_DELAY_MS,
    backoffFactor: options.backoffFactor ?? 2,
    maxDelayMs: options.maxDelayMs ?? LIMITS.MAX_RETRY_DELAY_MS,
    shouldRetry: options.shouldRetry ?? (() => true),
  };
}

function getRetryDelay(
  attempt: number,
  delayMs: number,
  backoffFactor: number,
  maxDelayMs: number,
): number {
  return Math.min(delayMs * backoffFactor ** (attempt - 1), maxDelayMs);
}

async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options: ResolvedRetryOptions,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= options.attempts || !options.shouldRetry(error, attempt)) {
        break;
      }
      await sleep(
        getRetryDelay(attempt, options.delayMs, options.backoffFactor, options.maxDelayMs),
      );
    }
  }

  throw lastError;
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  return executeWithRetry(fn, resolveRetryOptions(options));
}
