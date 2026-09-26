import type { EventHeaders } from './headers.js';
import type { EventMetadata } from './metadata.js';

export type EventKind = 'domain' | 'integration' | 'internal';

export interface EventEnvelope<TPayload = unknown> {
  readonly kind: EventKind;
  readonly metadata: EventMetadata;
  readonly headers: EventHeaders;
  readonly payload: TPayload;
}
