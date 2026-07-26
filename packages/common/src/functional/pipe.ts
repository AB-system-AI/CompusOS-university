export function identity<T>(value: T): T {
  return value;
}

export function noop(): void {
  // intentional no-op
}

type UnaryFn = (input: unknown) => unknown;

export function pipe<T>(value: T): T;
export function pipe<T, A>(value: T, fn1: (input: T) => A): A;
export function pipe<T, A, B>(value: T, fn1: (input: T) => A, fn2: (input: A) => B): B;
export function pipe<T, A, B, C>(
  value: T,
  fn1: (input: T) => A,
  fn2: (input: A) => B,
  fn3: (input: B) => C,
): C;
export function pipe(value: unknown, ...fns: UnaryFn[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

export function compose<T>(fn: (input: T) => T): (input: T) => T;
export function compose<T, A>(fn2: (input: A) => T, fn1: (input: T) => A): (input: T) => T;
export function compose<T, A, B>(
  fn3: (input: B) => T,
  fn2: (input: A) => B,
  fn1: (input: T) => A,
): (input: T) => T;
export function compose(...fns: UnaryFn[]): (input: unknown) => unknown {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}
