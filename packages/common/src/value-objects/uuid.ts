import { REGEX } from '../constants/regex.js';
import { ValidationError } from '../errors/errors.js';
import { failure, success, type Result } from '../result/result.js';

export class UUID {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value.toLowerCase();
    Object.freeze(this);
  }

  static create(value: string): Result<UUID, ValidationError> {
    const trimmed = value.trim();
    if (!REGEX.UUID.test(trimmed)) {
      return failure(new ValidationError('Invalid UUID format', { details: { value } }));
    }
    return success(new UUID(trimmed));
  }

  static generate(): UUID {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    const formatted = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    return new UUID(formatted);
  }

  toString(): string {
    return this.value;
  }

  equals(other: UUID): boolean {
    return this.value === other.value;
  }
}
