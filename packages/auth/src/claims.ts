import type { TenantId, UserId } from './identity.js';
import type { Permission, PermissionSet } from './permissions.js';
import type { Role, RoleSet } from './roles.js';
import type { Scope, ScopeSet } from './scopes.js';

export type ClaimValue =
  | string
  | number
  | boolean
  | null
  | readonly (string | number | boolean | null)[]
  | Readonly<Record<string, string | number | boolean | null>>;
export type Claim = Readonly<{ name: string; value: ClaimValue }>;
export class ClaimSet {
  readonly #claims: readonly Claim[];
  private constructor(claims: Iterable<Claim>) {
    const values: Claim[] = [];
    for (const claim of claims) values.push(Object.freeze({ ...claim }));
    this.#claims = Object.freeze(values);
    Object.freeze(this);
  }
  static create(claims: Iterable<Claim> = []): ClaimSet {
    return new ClaimSet(claims);
  }
  get(name: string): ClaimValue | undefined {
    return this.#claims.find((claim) => claim.name === name)?.value;
  }
  has(name: string): boolean {
    return this.#claims.some((claim) => claim.name === name);
  }
  entries(): readonly Claim[] {
    return this.#claims;
  }
}
export type StandardClaims = Readonly<{
  subjectId: UserId;
  tenantId?: TenantId;
  roles?: RoleSet | readonly Role[];
  permissions?: PermissionSet | readonly Permission[];
  scopes?: ScopeSet | readonly Scope[];
}>;
