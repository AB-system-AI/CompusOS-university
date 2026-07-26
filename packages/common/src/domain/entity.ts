export abstract class Entity<TId> {
  protected constructor(protected readonly id: TId) {}

  getId(): TId {
    return this.id;
  }

  equals(other: Entity<TId>): boolean {
    if (other.constructor !== this.constructor) return false;
    return this.id === other.id;
  }
}
