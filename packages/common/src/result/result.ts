export type SuccessResult<T> = {
  readonly success: true;
  readonly value: T;
};

export type FailureResult<E> = {
  readonly success: false;
  readonly error: E;
};

export type Result<T, E = Error> = SuccessResult<T> | FailureResult<E>;

export function success<T>(value: T): SuccessResult<T> {
  return { success: true, value };
}

export function failure<E>(error: E): FailureResult<E> {
  return { success: false, error };
}

export function isSuccess<T, E>(result: Result<T, E>): result is SuccessResult<T> {
  return result.success;
}

export function isFailure<T, E>(result: Result<T, E>): result is FailureResult<E> {
  return !result.success;
}
