import { DatabaseValidationError } from './errors.js';

export type SortDirection = 'ascending' | 'descending';
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'isNull'
  | 'isNotNull';
export type QueryFilter = Readonly<{ field: string; operator: FilterOperator; value?: unknown }>;
export type Sort = Readonly<{ field: string; direction: SortDirection }>;
export type QueryOptions = Readonly<{ filters?: readonly QueryFilter[]; sort?: readonly Sort[] }>;
export type QueryResult<T> = Readonly<{ rows: readonly T[]; rowCount: number }>;
const FIELD_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;
export function createFilter(filter: QueryFilter): QueryFilter {
  if (
    !FIELD_PATTERN.test(filter.field) ||
    (filter.operator !== 'isNull' && filter.operator !== 'isNotNull' && filter.value === undefined)
  )
    throw new DatabaseValidationError('Invalid query filter', 'filter');
  return Object.freeze({ ...filter });
}
export function createSort(sort: Sort): Sort {
  if (!FIELD_PATTERN.test(sort.field) || !['ascending', 'descending'].includes(sort.direction))
    throw new DatabaseValidationError('Invalid query sort', 'sort');
  return Object.freeze({ ...sort });
}
export function createQueryOptions(options: QueryOptions = {}): QueryOptions {
  return Object.freeze({
    filters: options.filters ? Object.freeze(options.filters.map(createFilter)) : undefined,
    sort: options.sort ? Object.freeze(options.sort.map(createSort)) : undefined,
  });
}
