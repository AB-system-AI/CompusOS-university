import { createValidatedValue, type ValidationResult } from './validation.js';

declare const permissionBrand: unique symbol;
export type PermissionId = string & { readonly [permissionBrand]: 'PermissionId' };
export type Permission = PermissionId;
const PERMISSION_PATTERN = /^[a-z][a-z0-9-]*(?::[a-z][a-z0-9-]*)+$/;

export function createPermission(value: string): ValidationResult<Permission> {
  return createValidatedValue<Permission>(value, 'permission', PERMISSION_PATTERN);
}
export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && PERMISSION_PATTERN.test(value);
}

export class PermissionSet {
  readonly #values: ReadonlySet<Permission>;
  private constructor(values: Iterable<Permission>) {
    this.#values = new Set(values);
    Object.freeze(this);
  }
  static create(values: Iterable<Permission> = []): PermissionSet {
    return new PermissionSet(values);
  }
  has(permission: Permission): boolean {
    return this.#values.has(permission);
  }
  hasAny(values: Iterable<Permission>): boolean {
    return [...values].some((value) => this.has(value));
  }
  hasAll(values: Iterable<Permission>): boolean {
    return [...values].every((value) => this.has(value));
  }
  values(): readonly Permission[] {
    return Object.freeze([...this.#values]);
  }
}
export function hasPermission(permissions: PermissionSet, permission: Permission): boolean {
  return permissions.has(permission);
}
export function hasAnyPermission(
  permissions: PermissionSet,
  required: Iterable<Permission>,
): boolean {
  return permissions.hasAny(required);
}
export function hasAllPermissions(
  permissions: PermissionSet,
  required: Iterable<Permission>,
): boolean {
  return permissions.hasAll(required);
}
