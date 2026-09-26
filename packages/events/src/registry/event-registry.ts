import type { EventName } from '../types/event-name.js';
import type { SchemaVersionMetadata } from '../versioning/version.js';

export interface EventDefinition extends SchemaVersionMetadata {
  readonly name: EventName;
  readonly version: number;
  readonly description?: string;
}

const registry = new Map<string, EventDefinition>();

export function registerEvent(definition: EventDefinition): void {
  if (registry.has(definition.name)) {
    throw new Error(`Event already registered: ${definition.name}`);
  }
  registry.set(definition.name, Object.freeze({ ...definition }));
}

export function getEventDefinition(name: EventName): EventDefinition | undefined {
  return registry.get(name);
}

export function listEvents(): EventDefinition[] {
  return [...registry.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function hasEvent(name: EventName): boolean {
  return registry.has(name);
}

export function clearEventRegistry(): void {
  registry.clear();
}
