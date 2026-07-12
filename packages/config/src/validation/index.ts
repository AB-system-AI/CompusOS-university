import type { ZodType } from 'zod';

export class ConfigValidationError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[]) {
    super(message);
    this.name = 'ConfigValidationError';
    this.issues = issues;
  }
}

function formatZodIssues(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.map(String).join('.') : 'root';
    return `${path}: ${issue.message}`;
  });
}

export function validateConfig<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = formatZodIssues(result.error);
    throw new ConfigValidationError('Configuration validation failed', issues);
  }
  return result.data;
}

export function validateConfigOrThrow<T>(schema: ZodType<T>, input: unknown): T {
  return validateConfig(schema, input);
}
