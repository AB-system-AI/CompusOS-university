import { EVENT_NAME_PATTERN } from './patterns.js';

export function isValidEventName(value: string): boolean {
  return EVENT_NAME_PATTERN.test(value);
}

export function assertValidEventName(value: string): void {
  if (!isValidEventName(value)) {
    throw new Error(
      `Invalid event name "${value}". Expected format: <context>.<aggregate>.<action>.v<major>`,
    );
  }
}

export function parseEventNameParts(value: string): {
  context: string;
  aggregate: string;
  action: string;
  versionLabel: string;
} {
  assertValidEventName(value);
  const parts = value.split('.');
  const context = parts[0];
  const aggregate = parts[1];
  const action = parts[2];
  const versionLabel = parts[3];
  if (!context || !aggregate || !action || !versionLabel) {
    throw new Error(`Invalid event name parts for "${value}"`);
  }
  return { context, aggregate, action, versionLabel };
}

export function buildEventName(
  context: string,
  aggregate: string,
  action: string,
  version: number,
): string {
  const eventName = `${context}.${aggregate}.${action}.v${String(version)}`;
  assertValidEventName(eventName);
  return eventName;
}
