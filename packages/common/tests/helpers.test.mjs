import { describe, expect, test } from 'bun:test';

import {
  chunk,
  compose,
  identity,
  parseIsoDate,
  pipe,
  retry,
  sleep,
  toKebabCase,
  unique,
} from '../src/index.js';

describe('Helpers', () => {
  test('pipe and compose', () => {
    const double = (n) => n * 2;
    const addOne = (n) => n + 1;
    expect(pipe(2, double, addOne)).toBe(5);
    expect(compose(addOne, double)(2)).toBe(5);
    expect(identity(7)).toBe(7);
  });

  test('array and string helpers', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(unique([1, 1, 2])).toEqual([1, 2]);
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  test('date helper parses ISO dates', () => {
    const date = parseIsoDate('2026-07-13');
    expect(date?.toISOString()).toBe('2026-07-13T00:00:00.000Z');
  });

  test('retry succeeds after transient failure', async () => {
    let attempts = 0;
    const value = await retry(
      async () => {
        attempts += 1;
        if (attempts < 2) throw new Error('temporary');
        return 'ok';
      },
      { attempts: 3, delayMs: 1 },
    );
    expect(value).toBe('ok');
    expect(attempts).toBe(2);
  });

  test('sleep resolves', async () => {
    const start = Date.now();
    await sleep(5);
    expect(Date.now() - start).toBeGreaterThanOrEqual(4);
  });
});
