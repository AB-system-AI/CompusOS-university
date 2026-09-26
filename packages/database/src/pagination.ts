import { DatabaseValidationError } from './errors.js';

export type PageRequest = Readonly<{ cursor?: string; limit: number }>;
export type PageMetadata = Readonly<{
  limit: number;
  nextCursor?: string;
  previousCursor?: string;
}>;
export type PageResult<T> = Readonly<{ items: readonly T[]; metadata: PageMetadata }>;
export function createPageRequest(request: Partial<PageRequest> = {}): PageRequest {
  const limit = request.limit ?? 25;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    throw new DatabaseValidationError('Page limit must be between 1 and 100', 'limit');
  if (request.cursor !== undefined && request.cursor.trim().length === 0)
    throw new DatabaseValidationError('Cursor cannot be empty', 'cursor');
  return Object.freeze({ cursor: request.cursor, limit });
}
export function createPageResult<T>(items: readonly T[], metadata: PageMetadata): PageResult<T> {
  return Object.freeze({
    items: Object.freeze([...items]),
    metadata: Object.freeze({ ...metadata }),
  });
}
