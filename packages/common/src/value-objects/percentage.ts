import { ValidationError } from '../errors/errors.js';
import { failure, success, type Result } from '../result/result.js';

export class Percentage {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value: number): Result<Percentage, ValidationError> {
    if (!Number.isFinite(value)) {
      return failure(new ValidationError('Percentage must be a finite number'));
    }
    if (value < 0 || value > 100) {
      return failure(new ValidationError('Percentage must be between 0 and 100'));
    }
    return success(new Percentage(value));
  }

  static fromDecimal(decimal: number): Result<Percentage, ValidationError> {
    if (!Number.isFinite(decimal)) {
      return failure(new ValidationError('Percentage must be a finite number'));
    }
    return Percentage.create(decimal * 100);
  }

  toNumber(): number {
    return this.value;
  }

  toDecimal(): number {
    return this.value / 100;
  }

  equals(other: Percentage): boolean {
    return this.value === other.value;
  }
}
