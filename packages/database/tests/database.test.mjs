import { describe, expect, test } from 'bun:test';
import {
  ConnectionError,
  DatabaseValidationError,
  createDatabaseConfig,
  createFilter,
  createPageRequest,
  createPageResult,
  createSort,
  orderMigrations,
  runInTransaction,
  sanitizeConnectionUrl,
} from '../src/index.js';

const config = () =>
  createDatabaseConfig({
    environment: 'test',
    url: 'postgresql://user:secret@localhost:5432/campus',
  });

describe('database configuration', () => {
  test('creates immutable PostgreSQL configuration with defaults', () => {
    expect(config().pool.maxConnections).toBe(10);
    expect(Object.isFrozen(config())).toBe(true);
    expect(sanitizeConnectionUrl('postgresql://user:secret@localhost:5432/campus')).toBe(
      'postgresql://localhost:5432/campus',
    );
  });
  test('rejects invalid configuration without exposing credentials', () => {
    expect(() =>
      createDatabaseConfig({ environment: 'test', url: 'mysql://user:secret@localhost/db' }),
    ).toThrow(DatabaseValidationError);
    expect(() =>
      createDatabaseConfig({
        environment: 'test',
        url: 'postgresql://localhost/db',
        maxConnections: -1,
      }),
    ).toThrow('Invalid connection pool configuration');
  });
});

describe('query and pagination primitives', () => {
  test('validates filters, sorting, and cursor requests', () => {
    expect(createFilter({ field: 'status', operator: 'equals', value: 'active' }).field).toBe(
      'status',
    );
    expect(createSort({ field: 'createdAt', direction: 'descending' }).direction).toBe(
      'descending',
    );
    expect(createPageRequest({ limit: 50, cursor: 'next' }).limit).toBe(50);
    expect(() => createFilter({ field: 'bad-field', operator: 'equals', value: 1 })).toThrow();
    expect(() => createPageRequest({ limit: 101 })).toThrow();
  });
  test('creates immutable page metadata', () => {
    const page = createPageResult([{ id: 1 }], { limit: 1, nextCursor: 'two' });
    expect(page.metadata.nextCursor).toBe('two');
    expect(Object.isFrozen(page.items)).toBe(true);
  });
});

describe('transactions and migrations', () => {
  test('commits successful transactional callbacks', async () => {
    const calls = [];
    const transaction = {
      active: true,
      commit: async () => calls.push('commit'),
      rollback: async () => calls.push('rollback'),
    };
    const result = await runInTransaction(
      { beginTransaction: async () => transaction },
      async () => 'done',
    );
    expect(result).toBe('done');
    expect(calls).toEqual(['commit']);
  });
  test('rolls back failed transactional callbacks', async () => {
    const calls = [];
    const transaction = {
      active: true,
      commit: async () => calls.push('commit'),
      rollback: async () => calls.push('rollback'),
    };
    await expect(
      runInTransaction({ beginTransaction: async () => transaction }, async () => {
        throw new ConnectionError();
      }),
    ).rejects.toThrow(ConnectionError);
    expect(calls).toEqual(['rollback']);
  });
  test('orders migrations and rejects duplicate versions', () => {
    const migrations = [
      { version: 2, name: 'second', up: async () => undefined },
      { version: 1, name: 'first', up: async () => undefined },
    ];
    expect(orderMigrations(migrations).map((migration) => migration.version)).toEqual([1, 2]);
    expect(() =>
      orderMigrations([
        { version: 1, name: 'one', up: async () => undefined },
        { version: 1, name: 'two', up: async () => undefined },
      ]),
    ).toThrow();
  });
});
