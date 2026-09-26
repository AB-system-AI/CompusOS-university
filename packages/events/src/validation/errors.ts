export class EventValidationError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[]) {
    super(message);
    this.name = 'EventValidationError';
    this.issues = issues;
  }
}
