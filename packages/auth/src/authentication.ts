import { type ClaimSet } from './claims.js';
import {
  type ClientId,
  type PrincipalId,
  type SessionId,
  type SubjectId,
  type TenantId,
  type UserId,
} from './identity.js';
import { type PermissionSet } from './permissions.js';
import { type RoleSet } from './roles.js';
import { type ScopeSet } from './scopes.js';
export type AuthenticationState =
  | 'authenticated'
  | 'unauthenticated'
  | 'invalid-credentials'
  | 'expired'
  | 'invalid-token'
  | 'revoked-session';
export type AuthenticationMethod =
  'password' | 'token' | 'session' | 'federated' | 'api-key' | 'mfa' | 'unknown';
export type AuthenticatedPrincipal = Readonly<{
  id: PrincipalId;
  subjectId: SubjectId;
  userId?: UserId;
  roles: RoleSet;
  permissions: PermissionSet;
  scopes: ScopeSet;
}>;
export type AuthenticationContext = Readonly<{
  state: AuthenticationState;
  principal?: AuthenticatedPrincipal;
  tenantId?: TenantId;
  sessionId?: SessionId;
  clientId?: ClientId;
  method?: AuthenticationMethod;
  authenticatedAt?: Date;
  claims: ClaimSet;
}>;
export function createAuthenticationContext(context: AuthenticationContext): AuthenticationContext {
  if (
    context.state === 'authenticated' &&
    (!context.principal || !context.method || !context.authenticatedAt)
  )
    throw new Error('Authenticated context requires principal, method, and authentication time');
  if (context.state !== 'authenticated' && context.principal)
    throw new Error('Only authenticated contexts may include a principal');
  return Object.freeze({
    ...context,
    authenticatedAt: context.authenticatedAt ? new Date(context.authenticatedAt) : undefined,
  });
}
