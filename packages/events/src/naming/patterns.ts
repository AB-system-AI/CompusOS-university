/** Canonical event name pattern: context.aggregate.action.v1 */
export const EVENT_NAME_PATTERN = /^[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.[a-z][a-z0-9]*\.v[1-9]\d*$/;

export const EVENT_NAME_EXAMPLES = [
  'identity.user.created.v1',
  'tenant.tenant.created.v1',
  'search.index.updated.v1',
] as const;
