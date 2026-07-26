import { LIMITS } from '../constants/limits.js';
import { REGEX } from '../constants/regex.js';
import { ValidationError } from '../errors/errors.js';
import { failure, success, type Result } from '../result/result.js';

export class Slug {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: string): Result<Slug, ValidationError> {
    const normalized = value.trim().toLowerCase();
    if (normalized.length === 0 || normalized.length > LIMITS.MAX_SLUG_LENGTH) {
      return failure(new ValidationError('Invalid slug length'));
    }
    if (!REGEX.SLUG.test(normalized)) {
      return failure(new ValidationError('Invalid slug format', { details: { value } }));
    }
    return success(new Slug(normalized));
  }

  static fromString(value: string): Result<Slug, ValidationError> {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return Slug.create(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
