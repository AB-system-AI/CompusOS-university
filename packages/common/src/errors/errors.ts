import { BaseError, type BaseErrorOptions } from './base-error.js';

export class ValidationError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'VALIDATION_ERROR', statusCode: 400 });
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'NOT_FOUND', statusCode: 404 });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'UNAUTHORIZED', statusCode: 401 });
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'FORBIDDEN', statusCode: 403 });
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'CONFLICT', statusCode: 409 });
  }
}

export class InternalError extends BaseError {
  constructor(message: string, options: Omit<BaseErrorOptions, 'statusCode'> = {}) {
    super(message, { ...options, code: options.code ?? 'INTERNAL_ERROR', statusCode: 500 });
  }
}
