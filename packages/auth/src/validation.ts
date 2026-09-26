const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const ACCESS_VALUE_PATTERN = /^[a-z][a-z0-9._:-]*$/;

export class AuthValidationError extends Error {
  readonly code = 'AUTH_VALIDATION_ERROR';
  constructor(
    message: string,
    readonly field: string,
  ) {
    super(message);
    this.name = 'AuthValidationError';
    Object.freeze(this);
  }
}
export type ValidationResult<T> =
  Readonly<{ success: true; value: T }> | Readonly<{ success: false; error: AuthValidationError }>;

export function createValidatedValue<T extends string>(
  value: string,
  label: string,
  pattern: RegExp,
): ValidationResult<T> {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > 128 || !pattern.test(normalized)) {
    return { success: false, error: new AuthValidationError(`Invalid ${label}`, label) };
  }
  return { success: true, value: normalized as T };
}

export function isValidIdentifier(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 128 && IDENTIFIER_PATTERN.test(value);
}

export function isValidAccessValue(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 128 && ACCESS_VALUE_PATTERN.test(value);
}

export const validationPatterns = Object.freeze({
  accessValue: ACCESS_VALUE_PATTERN,
  identifier: IDENTIFIER_PATTERN,
});
