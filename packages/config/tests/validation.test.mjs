import { describe, expect, test } from 'bun:test';

import { baseSchema, jwtSchema, validateConfig } from '../src/index.js';

describe('schemas', () => {
  test('validates base schema defaults', () => {
    const result = validateConfig(baseSchema, {
      appName: 'campusos',
    });
    expect(result.environment).toBe('development');
    expect(result.logLevel).toBe('info');
  });

  test('requires jwt secret or public key', () => {
    expect(() =>
      validateConfig(jwtSchema, {
        jwtIssuer: 'issuer',
        jwtAudience: 'audience',
      }),
    ).toThrow();
  });
});
