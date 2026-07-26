import { ValidationError } from '../errors/errors.js';
import { failure, success, type Result } from '../result/result.js';

const SUPPORTED_CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'EGP', 'SAR', 'AED']);

export class Money {
  private readonly amountMinor: number;
  private readonly currency: string;

  private constructor(amountMinor: number, currency: string) {
    this.amountMinor = amountMinor;
    this.currency = currency;
    Object.freeze(this);
  }

  static create(amountMinor: number, currency: string): Result<Money, ValidationError> {
    if (!Number.isInteger(amountMinor)) {
      return failure(new ValidationError('Money amount must be an integer in minor units'));
    }
    const normalizedCurrency = currency.trim().toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(normalizedCurrency)) {
      return failure(new ValidationError('Unsupported currency', { details: { currency } }));
    }
    return success(new Money(amountMinor, normalizedCurrency));
  }

  static fromMajor(amount: number, currency: string): Result<Money, ValidationError> {
    if (!Number.isFinite(amount)) {
      return failure(new ValidationError('Money amount must be finite'));
    }
    return Money.create(Math.round(amount * 100), currency);
  }

  getAmountMinor(): number {
    return this.amountMinor;
  }

  getCurrency(): string {
    return this.currency;
  }

  toMajor(): number {
    return this.amountMinor / 100;
  }

  equals(other: Money): boolean {
    return this.amountMinor === other.amountMinor && this.currency === other.currency;
  }
}
