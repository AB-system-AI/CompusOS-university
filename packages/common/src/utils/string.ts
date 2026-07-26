export function capitalize(value: string): string {
  if (value.length === 0) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function truncate(value: string, maxLength: number, suffix = '...'): string {
  if (value.length <= maxLength) return value;
  if (maxLength <= suffix.length) return value.slice(0, maxLength);
  return `${value.slice(0, maxLength - suffix.length)}${suffix}`;
}

export function stripWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function toCamelCase(value: string): string {
  const parts = value
    .trim()
    .split(/[\s_-]+/)
    .filter((part): part is string => part.length > 0);
  if (parts.length === 0) return '';
  const first = parts[0];
  if (!first) return '';
  const rest = parts.slice(1);
  return `${first.toLowerCase()}${rest.map((part) => capitalize(part.toLowerCase())).join('')}`;
}
