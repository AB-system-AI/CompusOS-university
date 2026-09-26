import { createValidatedValue, isValidIdentifier, type ValidationResult } from './validation.js';

declare const identityBrand: unique symbol;
type Identifier<T extends string> = string & { readonly [identityBrand]: T };
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export type PrincipalId = Identifier<'PrincipalId'>;
export type SubjectId = Identifier<'SubjectId'>;
export type UserId = Identifier<'UserId'>;
export type TenantId = Identifier<'TenantId'>;
export type SessionId = Identifier<'SessionId'>;
export type ClientId = Identifier<'ClientId'>;

function createIdentifier<T extends string>(
  value: string,
  label: string,
): ValidationResult<Identifier<T>> {
  return createValidatedValue<Identifier<T>>(value, label, IDENTIFIER_PATTERN);
}

export function createPrincipalId(value: string): ValidationResult<PrincipalId> {
  return createIdentifier<'PrincipalId'>(value, 'principal identifier');
}
export function createSubjectId(value: string): ValidationResult<SubjectId> {
  return createIdentifier<'SubjectId'>(value, 'subject identifier');
}
export function createUserId(value: string): ValidationResult<UserId> {
  return createIdentifier<'UserId'>(value, 'user identifier');
}
export function createTenantId(value: string): ValidationResult<TenantId> {
  return createIdentifier<'TenantId'>(value, 'tenant identifier');
}
export function createSessionId(value: string): ValidationResult<SessionId> {
  return createIdentifier<'SessionId'>(value, 'session identifier');
}
export function createClientId(value: string): ValidationResult<ClientId> {
  return createIdentifier<'ClientId'>(value, 'client identifier');
}

export const isPrincipalId = isValidIdentifier as (value: unknown) => value is PrincipalId;
export const isSubjectId = isValidIdentifier as (value: unknown) => value is SubjectId;
export const isUserId = isValidIdentifier as (value: unknown) => value is UserId;
export const isTenantId = isValidIdentifier as (value: unknown) => value is TenantId;
export const isSessionId = isValidIdentifier as (value: unknown) => value is SessionId;
export const isClientId = isValidIdentifier as (value: unknown) => value is ClientId;
