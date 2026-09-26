import { parseEventNameParts } from '../naming/event-name.js';
import type { EventName } from '../types/event-name.js';

export function parseEventVersion(eventName: EventName): number {
  const { versionLabel } = parseEventNameParts(eventName);
  return Number(versionLabel.slice(1));
}

export function extractEventBaseName(eventName: EventName): string {
  const parts = parseEventNameParts(eventName);
  return `${parts.context}.${parts.aggregate}.${parts.action}`;
}

export function bumpEventVersion(eventName: EventName, newVersion: number): string {
  const base = extractEventBaseName(eventName);
  return `${base}.v${String(newVersion)}`;
}

export function isVersionCompatible(
  eventName: EventName,
  compatibleVersions: readonly number[],
): boolean {
  const version = parseEventVersion(eventName);
  return compatibleVersions.includes(version);
}

export interface SchemaVersionMetadata {
  readonly schemaVersion: string;
  readonly compatibleVersions: readonly number[];
}

export function createSchemaVersionMetadata(
  schemaVersion: string,
  compatibleVersions: readonly number[],
): SchemaVersionMetadata {
  return Object.freeze({
    schemaVersion,
    compatibleVersions: Object.freeze([...compatibleVersions]),
  });
}
