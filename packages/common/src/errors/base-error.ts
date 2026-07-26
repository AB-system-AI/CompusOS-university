export interface BaseErrorOptions {
  code?: string;
  statusCode?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = new.target.name;
    this.code = options.code ?? 'BASE_ERROR';
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}
