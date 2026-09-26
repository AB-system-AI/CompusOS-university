export class DatabaseError extends Error {
  constructor(
    message: string,
    readonly code = 'DATABASE_ERROR',
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
export class ConnectionError extends DatabaseError {
  constructor(message = 'Database connection failed', cause?: unknown) {
    super(message, 'CONNECTION_ERROR', cause);
    this.name = 'ConnectionError';
  }
}
export class QueryError extends DatabaseError {
  constructor(message = 'Database query failed', cause?: unknown) {
    super(message, 'QUERY_ERROR', cause);
    this.name = 'QueryError';
  }
}
export class TransactionError extends DatabaseError {
  constructor(message = 'Database transaction failed', cause?: unknown) {
    super(message, 'TRANSACTION_ERROR', cause);
    this.name = 'TransactionError';
  }
}
export class ConstraintViolationError extends DatabaseError {
  constructor(message = 'Database constraint violated', cause?: unknown) {
    super(message, 'CONSTRAINT_VIOLATION', cause);
    this.name = 'ConstraintViolationError';
  }
}
export class DatabaseNotFoundError extends DatabaseError {
  constructor(message = 'Database record not found') {
    super(message, 'NOT_FOUND');
    this.name = 'DatabaseNotFoundError';
  }
}
export class DatabaseTimeoutError extends DatabaseError {
  constructor(message = 'Database operation timed out', cause?: unknown) {
    super(message, 'TIMEOUT', cause);
    this.name = 'DatabaseTimeoutError';
  }
}
export class DatabaseValidationError extends DatabaseError {
  constructor(
    message: string,
    readonly field: string,
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'DatabaseValidationError';
  }
}
