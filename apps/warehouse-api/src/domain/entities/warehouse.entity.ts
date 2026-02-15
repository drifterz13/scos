import type { Coordinates } from "../value-objects/coordinates.vo";

export class Warehouse {
  constructor(
    public readonly id: string,
    public name: string,
    public coordinates: Coordinates,
    public stockQuantity: number,
  ) {}

  setName(name: string): void {
    this.name = name;
  }

  setCoordinates(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }

  setStockQuantity(stockQuantity: number): void {
    this.stockQuantity = stockQuantity;
  }
}
