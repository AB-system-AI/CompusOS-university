import { createValidatedValue, type ValidationResult } from './validation.js';

declare const scopeBrand: unique symbol;
export type Scope = string & { readonly [scopeBrand]: 'Scope' };
const SCOPE_PATTERN = /^[a-z][a-z0-9-]*(?::[a-z][a-z0-9-]*)*$/;

export function createScope(value: string): ValidationResult<Scope> {
  return createValidatedValue<Scope>(value, 'scope', SCOPE_PATTERN);
}
export function isScope(value: unknown): value is Scope {
  return typeof value === 'string' && SCOPE_PATTERN.test(value);
}

export class ScopeSet {
  readonly #values: ReadonlySet<Scope>;
  private constructor(values: Iterable<Scope>) {
    this.#values = new Set(values);
    Object.freeze(this);
  }
  static create(values: Iterable<Scope> = []): ScopeSet {
    return new ScopeSet(values);
  }
  has(scope: Scope): boolean {
    return this.#values.has(scope);
  }
  hasAny(values: Iterable<Scope>): boolean {
    return [...values].some((value) => this.has(value));
  }
  hasAll(values: Iterable<Scope>): boolean {
    return [...values].every((value) => this.has(value));
  }
  values(): readonly Scope[] {
    return Object.freeze([...this.#values]);
  }
}
export function hasScope(scopes: ScopeSet, scope: Scope): boolean {
  return scopes.has(scope);
}
export function hasAnyScope(scopes: ScopeSet, required: Iterable<Scope>): boolean {
  return scopes.hasAny(required);
}
export function hasAllScopes(scopes: ScopeSet, required: Iterable<Scope>): boolean {
  return scopes.hasAll(required);
}
