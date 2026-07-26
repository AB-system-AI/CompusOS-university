export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0) throw new Error('Chunk size must be greater than zero');
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function uniqueBy<T>(items: readonly T[], selector: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  const result: T[] = [];
  for (const item of items) {
    const key = selector(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export function groupBy<T, K extends string | number>(
  items: readonly T[],
  selector: (item: T) => K,
): Record<K, T[]> {
  const result = {} as Record<K, T[]>;
  for (const item of items) {
    const key = selector(item);
    if (!(key in result)) {
      result[key] = [item];
      continue;
    }
    result[key].push(item);
  }
  return result;
}

export function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

export function last<T>(items: readonly T[]): T | undefined {
  return items.length > 0 ? items[items.length - 1] : undefined;
}
