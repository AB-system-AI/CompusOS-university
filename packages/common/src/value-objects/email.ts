import { LIMITS } from '../constants/limits.js';
import { REGEX } from '../constants/regex.js';
import { ValidationError } from '../errors/errors.js';
import { failure, success, type Result } from '../result/result.js';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Result<Email, ValidationError> {
    const normalized = value.trim().toLowerCase();
    if (normalized.length === 0 || normalized.length > LIMITS.MAX_EMAIL_LENGTH) {
      return failure(new ValidationError('Invalid email length'));
    }
    if (!REGEX.EMAIL.test(normalized)) {
      return failure(new ValidationError('Invalid email format', { details: { value } }));
    }
    return success(new Email(normalized));
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
