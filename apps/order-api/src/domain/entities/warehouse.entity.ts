import type { Coordinates } from "../value-objects/coordinates.vo";

export class Warehouse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly coordinates: Coordinates,
    public readonly stockQuantity: number,
  ) {}

  canFulfill(quantity: number): boolean {
    return this.stockQuantity >= quantity;
  }

  distanceTo(destination: Coordinates): number {
    return this.coordinates.distanceTo(destination);
  }
}
