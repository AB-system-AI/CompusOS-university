import { type AuthenticationContext, type AuthenticationState } from './authentication.js';
import { type ClaimSet } from './claims.js';
import { type ClientId, type SessionId, type TenantId } from './identity.js';
declare const accessTokenBrand: unique symbol;
declare const refreshTokenBrand: unique symbol;
export type AccessToken = string & { readonly [accessTokenBrand]: 'AccessToken' };
export type RefreshToken = string & { readonly [refreshTokenBrand]: 'RefreshToken' };
export type TokenType = 'access' | 'refresh';
export type TokenClaims = Readonly<{
  claims: ClaimSet;
  issuedAt: Date;
  expiresAt: Date;
  tenantId?: TenantId;
  clientId?: ClientId;
}>;
export interface TokenVerifier {
  verify(token: AccessToken | RefreshToken, type: TokenType): Promise<AuthenticationContext>;
}
export interface TokenIssuer {
  issue(claims: TokenClaims, type: TokenType): Promise<AccessToken | RefreshToken>;
}
export type SessionStatus = 'active' | 'expired' | 'revoked';
export type Session = Readonly<{
  id: SessionId;
  status: SessionStatus;
  context: AuthenticationContext;
  createdAt: Date;
  expiresAt: Date;
}>;
export interface SessionStore {
  get(id: SessionId): Promise<Session | undefined>;
  save(session: Session): Promise<void>;
  remove(id: SessionId): Promise<void>;
}
export interface SessionManager {
  create(context: AuthenticationContext, expiresAt: Date): Promise<Session>;
  getContext(id: SessionId): Promise<AuthenticationContext>;
  revoke(id: SessionId): Promise<void>;
}
export type AuthenticationResult = Readonly<{
  state: AuthenticationState;
  context?: AuthenticationContext;
  reason?: string;
}>;
