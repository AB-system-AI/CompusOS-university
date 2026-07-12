import type { ZodType } from 'zod';

import { mapEnvToRawConfig, rawConfigToAppInput } from '../env/index.js';
import { appConfigSchema } from '../schemas/index.js';
import type { AppConfig } from '../types/index.js';
import { validateConfig } from '../validation/index.js';

export interface LoadConfigOptions {
  env?: NodeJS.ProcessEnv;
  overrides?: Record<string, string | undefined>;
}

function freezeConfig<T extends object>(value: T): Readonly<T> {
  return Object.freeze(value);
}

export function loadConfig(options: LoadConfigOptions = {}): Readonly<AppConfig> {
  const env = options.env ?? process.env;
  const raw = mapEnvToRawConfig(env, options.overrides);
  const input = rawConfigToAppInput(raw);
  const validated = validateConfig(appConfigSchema, input);
  return freezeConfig(validated);
}

export function loadPartialConfig<T extends object>(
  schema: ZodType<T>,
  section: unknown,
): Readonly<T> {
  const validated = validateConfig(schema, section);
  return freezeConfig(validated);
}
