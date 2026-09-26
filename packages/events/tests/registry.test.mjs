import { afterEach, describe, expect, test } from 'bun:test';

import {
  clearEventRegistry,
  createSchemaVersionMetadata,
  getEventDefinition,
  hasEvent,
  isVersionCompatible,
  listEvents,
  parseEventVersion,
  registerEvent,
} from '../src/index.js';

describe('registry', () => {
  afterEach(() => {
    clearEventRegistry();
  });

  test('registers and lists events', () => {
    registerEvent({
      name: 'identity.user.created.v1',
      version: 1,
      schemaVersion: '1.0.0',
      compatibleVersions: [1],
      description: 'User created',
    });

    expect(hasEvent('identity.user.created.v1')).toBe(true);
    expect(getEventDefinition('identity.user.created.v1')?.description).toBe('User created');
    expect(listEvents()).toHaveLength(1);
  });
});

describe('version compatibility', () => {
  test('parses event version and checks compatibility', () => {
    const metadata = createSchemaVersionMetadata('1.0.0', [1, 2]);
    expect(parseEventVersion('identity.user.created.v1')).toBe(1);
    expect(isVersionCompatible('identity.user.created.v2', metadata.compatibleVersions)).toBe(true);
    expect(isVersionCompatible('identity.user.created.v3', metadata.compatibleVersions)).toBe(
      false,
    );
  });
});
