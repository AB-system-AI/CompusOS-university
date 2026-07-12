import { ENVIRONMENTS } from '../constants/environments.js';

const ENVIRONMENT_SET = new Set<string>(ENVIRONMENTS);

export function isEnvironment(value: string): value is (typeof ENVIRONMENTS)[number] {
  return ENVIRONMENT_SET.has(value);
}

export function getEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): (typeof ENVIRONMENTS)[number] {
  const raw = env.CAMPUSOS_ENV ?? env.NODE_ENV ?? 'development';
  if (isEnvironment(raw)) return raw;
  return 'development';
}

export function isDevelopment(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = getEnvironment(env);
  return value === 'development' || value === 'local';
}

export function isTest(env: NodeJS.ProcessEnv = process.env): boolean {
  return getEnvironment(env) === 'test';
}

export function isStaging(env: NodeJS.ProcessEnv = process.env): boolean {
  return getEnvironment(env) === 'staging';
}

export function isProduction(env: NodeJS.ProcessEnv = process.env): boolean {
  return getEnvironment(env) === 'production';
}

export function isLocal(env: NodeJS.ProcessEnv = process.env): boolean {
  return getEnvironment(env) === 'local';
}
