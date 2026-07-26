import { describe, expect, test } from 'bun:test';

import {
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../src/index.js';

describe('Errors', () => {
  test('error hierarchy exposes status codes', () => {
    expect(new ValidationError('bad').statusCode).toBe(400);
    expect(new UnauthorizedError('auth').statusCode).toBe(401);
    expect(new ForbiddenError('deny').statusCode).toBe(403);
    expect(new NotFoundError('missing').statusCode).toBe(404);
    expect(new ConflictError('dup').statusCode).toBe(409);
    expect(new InternalError('boom').statusCode).toBe(500);
  });

  test('errors serialize to JSON', () => {
    const error = new ValidationError('invalid', { details: { field: 'email' } });
    expect(error.toJSON()).toMatchObject({
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      message: 'invalid',
    });
  });
});
