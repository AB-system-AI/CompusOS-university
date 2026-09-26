export type CorrelationId = string;
export type CausationId = string;
export type TenantId = string;
export type UserId = string;
export type TraceId = string;
export type AggregateId = string;
export type EventId = string;

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
