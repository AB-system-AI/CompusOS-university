import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = `// Constants
export { DEFAULT_SCHEMA_VERSION, REQUIRED_ENVELOPE_FIELDS } from './constants/index.js';

// Types
export type {
  AggregateId,
  CausationId,
  CorrelationId,
  DomainEvent,
  EventEnvelope,
  EventHeaders,
  EventId,
  EventKind,
  EventMetadata,
  EventName,
  EventVersion,
  IntegrationEvent,
  InternalEvent,
  TenantId,
  TraceId,
  UserId,
} from './types/index.js';

// Naming
export {
  EVENT_NAME_EXAMPLES,
  EVENT_NAME_PATTERN,
  assertValidEventName,
  buildEventName,
  isValidEventName,
  parseEventNameParts,
} from './naming/index.js';

// Factory
export {
  cloneEvent,
  createEvent,
  withHeaders,
  withMetadata,
  type CreateEventInput,
} from './factory/index.js';

// Serialization
export { deserializeEvent, serializeEvent } from './serialization/index.js';

// Validation
export { EventValidationError, validateEnvelope } from './validation/index.js';

// Registry
export {
  clearEventRegistry,
  getEventDefinition,
  hasEvent,
  listEvents,
  registerEvent,
  type EventDefinition,
} from './registry/index.js';

// Versioning
export {
  bumpEventVersion,
  createSchemaVersionMetadata,
  extractEventBaseName,
  isVersionCompatible,
  parseEventVersion,
  type SchemaVersionMetadata,
} from './versioning/index.js';
`;

writeFileSync(join(root, 'src/index.ts'), content, 'utf8');
