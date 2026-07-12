const TRUTHY = new Set(['true', '1', 'yes', 'on']);
const FALSY = new Set(['false', '0', 'no', 'off']);

export function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined || value === '') return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (TRUTHY.has(normalized)) return true;
  if (FALSY.has(normalized)) return false;
  throw new Error(`Invalid boolean value: "${value}"`);
}

export function parseNumber(value: string | undefined, defaultValue?: number): number {
  if (value === undefined || value === '') {
    if (defaultValue === undefined) {
      throw new Error('Missing required numeric value');
    }
    return defaultValue;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value: "${value}"`);
  }
  return parsed;
}

const DURATION_PATTERN = /^(\d+(?:\.\d+)?)(ms|s|m|h)$/i;

const DURATION_MULTIPLIERS: Record<string, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
};

export function parseDuration(value: string | undefined, defaultValue?: number): number {
  if (value === undefined || value === '') {
    if (defaultValue === undefined) {
      throw new Error('Missing required duration value');
    }
    return defaultValue;
  }
  const trimmed = value.trim();
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) return numeric;
  const match = DURATION_PATTERN.exec(trimmed);
  if (!match) {
    throw new Error(`Invalid duration value: "${value}"`);
  }
  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase() ?? 'ms';
  const multiplier = DURATION_MULTIPLIERS[unit];
  if (multiplier === undefined) {
    throw new Error(`Invalid duration unit: "${unit}"`);
  }
  return Math.round(amount * multiplier);
}

export function parseSafeUrl(value: string | undefined, label = 'URL'): string {
  if (!value) {
    throw new Error(`Missing required ${label}`);
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid ${label}: "${value}"`);
  }
  if (
    !['http:', 'https:', 'redis:', 'rediss:', 'postgres:', 'postgresql:'].includes(parsed.protocol)
  ) {
    throw new Error(`Unsupported ${label} protocol: "${parsed.protocol}"`);
  }
  return parsed.toString();
}

export function parseCsv(value: string | undefined): string[] {
  if (!value || value.trim() === '') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
