/** Canonical CampusOS deployment environments. */
export const ENVIRONMENTS = ['development', 'test', 'staging', 'production', 'local'] as const;

export type EnvironmentName = (typeof ENVIRONMENTS)[number];

/** Default `NODE_ENV` values recognized by Node.js tooling. */
export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;
