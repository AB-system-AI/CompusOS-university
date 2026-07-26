import { REGEX } from '../constants/regex.js';

export function isValidDate(value: Date): boolean {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function parseIsoDate(value: string): Date | null {
  if (!REGEX.ISO_DATE.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return isValidDate(date) ? date : null;
}

export function toIsoDateString(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function addDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function startOfDayUtc(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export function diffInDays(from: Date, to: Date): number {
  const msPerDay = 86_400_000;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}
