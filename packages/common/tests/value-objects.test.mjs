import { describe, expect, test } from 'bun:test';

import { Email, Money, Percentage, Slug, UUID, isFailure, isSuccess } from '../src/index.js';

describe('Value Objects', () => {
  test('UUID create and generate', () => {
    const created = UUID.create('550e8400-e29b-41d4-a716-446655440000');
    expect(isSuccess(created)).toBe(true);
    if (isSuccess(created)) {
      expect(created.value.toString()).toBe('550e8400-e29b-41d4-a716-446655440000');
    }

    const invalid = UUID.create('not-a-uuid');
    expect(isFailure(invalid)).toBe(true);

    const generated = UUID.generate();
    expect(UUID.create(generated.toString()).success).toBe(true);
  });

  test('Email validates format', () => {
    const valid = Email.create('user@example.com');
    expect(isSuccess(valid)).toBe(true);

    const invalid = Email.create('invalid-email');
    expect(isFailure(invalid)).toBe(true);
  });

  test('Slug normalizes values', () => {
    const slug = Slug.fromString('Hello World');
    expect(isSuccess(slug)).toBe(true);
    if (isSuccess(slug)) {
      expect(slug.value.toString()).toBe('hello-world');
    }
  });

  test('Money stores minor units', () => {
    const money = Money.fromMajor(12.34, 'USD');
    expect(isSuccess(money)).toBe(true);
    if (isSuccess(money)) {
      expect(money.value.getAmountMinor()).toBe(1234);
      expect(money.value.toMajor()).toBe(12.34);
    }
  });

  test('Percentage enforces range', () => {
    const valid = Percentage.create(75);
    expect(isSuccess(valid)).toBe(true);

    const invalid = Percentage.create(150);
    expect(isFailure(invalid)).toBe(true);
  });
});
