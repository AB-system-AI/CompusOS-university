import { createValidatedValue, type ValidationResult } from './validation.js';

declare const roleBrand: unique symbol;
export type RoleId = string & { readonly [roleBrand]: 'RoleId' };
export type Role = RoleId;
const ROLE_PATTERN = /^[a-z][a-z0-9._:-]*$/;

export function createRole(value: string): ValidationResult<Role> {
  return createValidatedValue<Role>(value, 'role', ROLE_PATTERN);
}
export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && ROLE_PATTERN.test(value);
}

export class RoleSet {
  readonly #values: ReadonlySet<Role>;
  private constructor(values: Iterable<Role>) {
    this.#values = new Set(values);
    Object.freeze(this);
  }
  static create(values: Iterable<Role> = []): RoleSet {
    return new RoleSet(values);
  }
  has(role: Role): boolean {
    return this.#values.has(role);
  }
  hasAny(roles: Iterable<Role>): boolean {
    return [...roles].some((role) => this.has(role));
  }
  hasAll(roles: Iterable<Role>): boolean {
    return [...roles].every((role) => this.has(role));
  }
  values(): readonly Role[] {
    return Object.freeze([...this.#values]);
  }
}
export function hasRole(roles: RoleSet, role: Role): boolean {
  return roles.has(role);
}
export function hasAnyRole(roles: RoleSet, required: Iterable<Role>): boolean {
  return roles.hasAny(required);
}
export function hasAllRoles(roles: RoleSet, required: Iterable<Role>): boolean {
  return roles.hasAll(required);
}
