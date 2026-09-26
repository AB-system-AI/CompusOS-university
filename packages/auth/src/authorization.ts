import { type AuthenticationContext } from './authentication.js';
import { type Permission } from './permissions.js';
import { type Role } from './roles.js';
import { type Scope } from './scopes.js';
export type AuthorizationEffect = 'allow' | 'deny';
export type AuthorizationReason = Readonly<{ code: string; message: string }>;
export type AuthorizationRequest = Readonly<{
  context: AuthenticationContext;
  resource: string;
  action: string;
  requiredRoles?: readonly Role[];
  requiredPermissions?: readonly Permission[];
  requiredScopes?: readonly Scope[];
}>;
export type AuthorizationDecision = Readonly<{
  effect: AuthorizationEffect;
  reason: AuthorizationReason;
}>;
export interface AuthorizationPolicy {
  evaluate(request: AuthorizationRequest): AuthorizationDecision;
}
export interface AuthorizationEvaluator {
  evaluate(
    request: AuthorizationRequest,
    policies: readonly AuthorizationPolicy[],
  ): AuthorizationDecision;
}
export function createAuthorizationRequest(request: AuthorizationRequest): AuthorizationRequest {
  if (request.resource.trim().length === 0 || request.action.trim().length === 0)
    throw new Error('Authorization request requires resource and action');
  return Object.freeze({
    ...request,
    requiredRoles: request.requiredRoles ? Object.freeze([...request.requiredRoles]) : undefined,
    requiredPermissions: request.requiredPermissions
      ? Object.freeze([...request.requiredPermissions])
      : undefined,
    requiredScopes: request.requiredScopes ? Object.freeze([...request.requiredScopes]) : undefined,
  });
}
export function allow(reason: AuthorizationReason): AuthorizationDecision {
  return Object.freeze({ effect: 'allow', reason: Object.freeze({ ...reason }) });
}
export function deny(reason: AuthorizationReason): AuthorizationDecision {
  return Object.freeze({ effect: 'deny', reason: Object.freeze({ ...reason }) });
}
export const denyByDefaultEvaluator: AuthorizationEvaluator = Object.freeze({
  evaluate(
    request: AuthorizationRequest,
    policies: readonly AuthorizationPolicy[],
  ): AuthorizationDecision {
    if (request.context.state !== 'authenticated' || !request.context.principal)
      return deny({ code: 'UNAUTHENTICATED', message: 'Authentication is required' });
    if (policies.length === 0)
      return deny({ code: 'NO_POLICY', message: 'No authorization policy allowed this request' });
    for (const policy of policies) {
      const decision = policy.evaluate(request);
      if (decision.effect === 'deny') return decision;
    }
    return allow({
      code: 'POLICIES_ALLOWED',
      message: 'All authorization policies allowed this request',
    });
  },
});
export function allOf(...policies: readonly AuthorizationPolicy[]): AuthorizationPolicy {
  return Object.freeze({
    evaluate: (request: AuthorizationRequest): AuthorizationDecision =>
      policies
        .map((policy) => policy.evaluate(request))
        .find((decision) => decision.effect === 'deny') ??
      allow({ code: 'ALL_OF', message: 'All policies allowed this request' }),
  });
}
export function anyOf(...policies: readonly AuthorizationPolicy[]): AuthorizationPolicy {
  return Object.freeze({
    evaluate: (request: AuthorizationRequest): AuthorizationDecision =>
      policies
        .map((policy) => policy.evaluate(request))
        .find((decision) => decision.effect === 'allow') ??
      deny({ code: 'ANY_OF', message: 'No policy allowed this request' }),
  });
}
export function not(policy: AuthorizationPolicy): AuthorizationPolicy {
  return Object.freeze({
    evaluate: (request: AuthorizationRequest): AuthorizationDecision => {
      const decision = policy.evaluate(request);
      return decision.effect === 'allow'
        ? deny({ code: 'NOT', message: 'Negated policy denied this request' })
        : allow({ code: 'NOT', message: 'Negated policy allowed this request' });
    },
  });
}
