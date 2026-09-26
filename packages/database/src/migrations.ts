import { DatabaseValidationError } from './errors.js';

export type MigrationStatus = 'pending' | 'applied' | 'failed';
export type Migration = Readonly<{
  version: number;
  name: string;
  up(context: MigrationContext): Promise<void>;
  down?(context: MigrationContext): Promise<void>;
}>;
export interface MigrationContext {
  execute(statement: string, parameters?: readonly unknown[]): Promise<void>;
}
export type MigrationResult = Readonly<{ version: number; name: string; status: MigrationStatus }>;
export interface MigrationRunner {
  currentVersion(): Promise<number>;
  migrate(targetVersion?: number): Promise<readonly MigrationResult[]>;
}
export function orderMigrations(migrations: readonly Migration[]): readonly Migration[] {
  const ordered = [...migrations].sort((left, right) => left.version - right.version);
  if (
    ordered.some(
      (migration, index) =>
        migration.version < 1 ||
        migration.name.trim().length === 0 ||
        (index > 0 && migration.version === ordered[index - 1]?.version),
    )
  )
    throw new DatabaseValidationError('Invalid migration metadata', 'migration');
  return Object.freeze(ordered);
}
