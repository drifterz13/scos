export class Discount {
  constructor(public readonly percentage: number) {
    if (percentage < 0 || percentage > 100) throw new Error("Invalid discount percentage");
  }
}
