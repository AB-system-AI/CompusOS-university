import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = `// Result pattern
export {
  failure,
  isFailure,
  isSuccess,
  success,
  type FailureResult,
  type Result,
  type SuccessResult,
} from './result/index.js';

// Errors
export {
  BaseError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  type BaseErrorOptions,
} from './errors/index.js';

// Value objects
export { Email, Money, Percentage, Slug, UUID } from './value-objects/index.js';

// Domain
export { AggregateRoot, Entity, type DomainEvent } from './domain/index.js';

// Utilities
export {
  addDays,
  capitalize,
  chunk,
  debounceAsync,
  deepFreeze,
  diffInDays,
  first,
  groupBy,
  isPlainObject,
  isValidDate,
  last,
  mapAsync,
  omit,
  parallel,
  parseIsoDate,
  pick,
  retry,
  sequential,
  sleep,
  startOfDayUtc,
  stripWhitespace,
  toCamelCase,
  toIsoDateString,
  toKebabCase,
  truncate,
  unique,
  uniqueBy,
  type RetryOptions,
} from './utils/index.js';

// Functional helpers
export { compose, identity, noop, pipe } from './functional/index.js';

// Constants
export { LIMITS, PAGINATION, REGEX } from './constants/index.js';
`;

writeFileSync(join(root, 'src/index.ts'), content, 'utf8');
