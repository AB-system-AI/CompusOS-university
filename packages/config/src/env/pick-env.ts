function readEnvValue(env: NodeJS.ProcessEnv, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = env[key];
    if (value !== undefined) return value;
  }
  return undefined;
}

export function pickEnv(
  env: NodeJS.ProcessEnv,
  mapping: Record<string, readonly string[]>,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [target, keys] of Object.entries(mapping)) {
    result[target] = readEnvValue(env, keys);
  }
  return result;
}
