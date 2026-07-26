export async function mapAsync<T, R>(
  items: readonly T[],
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (const [index, item] of items.entries()) {
    results.push(await mapper(item, index));
  }
  return results;
}

export async function parallel<T>(tasks: readonly (() => Promise<T>)[]): Promise<T[]> {
  return Promise.all(tasks.map((task) => task()));
}

export async function sequential<T>(tasks: readonly (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

export function debounceAsync<TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<void>,
  waitMs: number,
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: TArgs) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      void fn(...args);
    }, waitMs);
  };
}
