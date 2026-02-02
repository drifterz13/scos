export class Quantity {
  constructor(public readonly value: number) {
    if (value <= 0) throw new Error("Quantity must be positive");
    if (!Number.isInteger(value)) throw new Error("Quantity must be an integer");
  }
}
