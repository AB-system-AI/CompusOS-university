import { describe, expect, test } from 'bun:test';
import {
  ClaimSet,
  PermissionSet,
  RoleSet,
  ScopeSet,
  allow,
  allOf,
  createAuthenticationContext,
  createAuthorizationRequest,
  createPermission,
  createPrincipalId,
  createRole,
  createScope,
  createSubjectId,
  deny,
  denyByDefaultEvaluator,
} from '../src/index.js';

const value = (result) => {
  expect(result.success).toBe(true);
  return result.value;
};
const role = value(createRole('tenant-admin'));
const permission = value(createPermission('course:read'));
const scope = value(createScope('courses:read'));
const context = createAuthenticationContext({
  state: 'authenticated',
  principal: {
    id: value(createPrincipalId('principal-1')),
    subjectId: value(createSubjectId('subject-1')),
    roles: RoleSet.create([role]),
    permissions: PermissionSet.create([permission]),
    scopes: ScopeSet.create([scope]),
  },
  method: 'token',
  authenticatedAt: new Date('2026-01-01T00:00:00Z'),
  claims: ClaimSet.create([{ name: 'department', value: 'engineering' }]),
});
const request = { context, resource: 'course', action: 'read' };

describe('identity and authentication', () => {
  test('creates branded principal identifiers and authenticated context', () => {
    expect(value(createPrincipalId('principal-1'))).toBe('principal-1');
    expect(context.state).toBe('authenticated');
    expect(Object.isFrozen(context)).toBe(true);
  });
  test('rejects invalid identifiers and invalid contexts', () => {
    expect(createPrincipalId('bad value').success).toBe(false);
    expect(() =>
      createAuthenticationContext({ state: 'authenticated', claims: ClaimSet.create() }),
    ).toThrow();
  });
});

describe('immutable access sets', () => {
  test('checks roles, permissions, and scopes', () => {
    expect(RoleSet.create([role]).hasAll([role])).toBe(true);
    expect(RoleSet.create([role]).hasAny([role])).toBe(true);
    expect(PermissionSet.create([permission]).hasAll([permission])).toBe(true);
    expect(PermissionSet.create([permission]).hasAny([permission])).toBe(true);
    expect(ScopeSet.create([scope]).hasAll([scope])).toBe(true);
    expect(ScopeSet.create([scope]).hasAny([scope])).toBe(true);
    expect(Object.isFrozen(RoleSet.create())).toBe(true);
  });
  test('rejects invalid role, permission, and scope values', () => {
    expect(createRole('Admin').success).toBe(false);
    expect(createPermission('course').success).toBe(false);
    expect(createScope('Course:read').success).toBe(false);
  });
});

describe('authorization', () => {
  test('allows policies, denies explicit policies, and denies by default', () => {
    expect(
      denyByDefaultEvaluator.evaluate(request, [
        { evaluate: () => allow({ code: 'OK', message: 'Allowed' }) },
      ]).effect,
    ).toBe('allow');
    expect(
      denyByDefaultEvaluator.evaluate(request, [
        { evaluate: () => deny({ code: 'NO', message: 'Denied' }) },
      ]).effect,
    ).toBe('deny');
    expect(denyByDefaultEvaluator.evaluate(request, []).effect).toBe('deny');
  });
  test('composes policies', () => {
    expect(
      allOf(
        { evaluate: () => allow({ code: 'ONE', message: 'Allowed' }) },
        { evaluate: () => allow({ code: 'TWO', message: 'Allowed' }) },
      ).evaluate(request).effect,
    ).toBe('allow');
  });
  test('validates authorization requests and represents invalid token states', () => {
    expect(() => createAuthorizationRequest({ ...request, resource: '' })).toThrow();
    expect(
      createAuthenticationContext({ state: 'invalid-token', claims: ClaimSet.create() }).state,
    ).toBe('invalid-token');
  });
});
