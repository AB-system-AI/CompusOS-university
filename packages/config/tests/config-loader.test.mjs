import { describe, expect, test } from 'bun:test';

import {
  ConfigValidationError,
  createMockConfig,
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
  loadConfig,
  parseBoolean,
  parseDuration,
  parseNumber,
  parseSafeUrl,
  withEnv,
} from '../src/index.js';

describe('parsers', () => {
  test('parseBoolean handles truthy and falsy values', () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean(undefined, true)).toBe(true);
  });

  test('parseDuration converts units to milliseconds', () => {
    expect(parseDuration('30s')).toBe(30_000);
    expect(parseDuration('5m')).toBe(300_000);
    expect(parseDuration('1500')).toBe(1500);
  });

  test('parseNumber rejects invalid values', () => {
    expect(parseNumber('42')).toBe(42);
    expect(() => parseNumber('invalid')).toThrow('Invalid numeric value');
  });

  test('parseSafeUrl validates supported protocols', () => {
    expect(parseSafeUrl('https://api.campusos.test')).toContain('https://');
    expect(() => parseSafeUrl('ftp://files.example')).toThrow('Unsupported');
  });
});

describe('environment helpers', () => {
  test('detects campusos environment', () => {
    expect(withEnv({ CAMPUSOS_ENV: 'staging' }, () => getEnvironment())).toBe('staging');
    expect(withEnv({ CAMPUSOS_ENV: 'test' }, () => isTest())).toBe(true);
    expect(withEnv({ CAMPUSOS_ENV: 'production' }, () => isProduction())).toBe(true);
    expect(withEnv({ CAMPUSOS_ENV: 'local' }, () => isDevelopment())).toBe(true);
  });
});

describe('config loader', () => {
  test('loads immutable mock configuration', () => {
    const config = createMockConfig();
    expect(config.base.appName).toBe('campusos-test');
    expect(config.database.url).toContain('postgresql://');
    expect(Object.isFrozen(config)).toBe(true);
  });

  test('fails fast on missing required values', () => {
    expect(() =>
      loadConfig({
        env: {},
        overrides: { CAMPUSOS_APP_NAME: 'missing-deps' },
      }),
    ).toThrow(ConfigValidationError);
  });

  test('supports testing overrides', () => {
    const config = createMockConfig({ CAMPUSOS_PORT: '5001' });
    expect(config.server.port).toBe(5001);
  });
});
