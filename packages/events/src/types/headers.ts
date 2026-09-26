import type { CausationId, CorrelationId, TenantId, TraceId, UserId } from './identifiers.js';

export interface EventHeaders {
  readonly correlationId: CorrelationId;
  readonly causationId: CausationId;
  readonly traceId: TraceId;
  readonly tenantId: TenantId;
  readonly userId?: UserId;
}
