import { describe, expect, test } from 'bun:test';

import { failure, isFailure, isSuccess, success } from '../src/index.js';

describe('Result', () => {
  test('success and failure helpers', () => {
    const ok = success(42);
    const err = failure(new Error('failed'));

    expect(isSuccess(ok)).toBe(true);
    expect(ok.value).toBe(42);
    expect(isFailure(err)).toBe(true);
    expect(err.error.message).toBe('failed');
  });
});
