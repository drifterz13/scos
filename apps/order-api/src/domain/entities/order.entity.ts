import type { Coordinates } from "../value-objects/coordinates.vo";
import type { Discount } from "../value-objects/discount.vo";
import type { Money } from "../value-objects/money.vo";
import type { Quantity } from "../value-objects/quantity.vo";

export enum OrderStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  CANCELLED = "CANCELLED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

export class Order {
  constructor(
    public readonly id: string,
    public orderNumber: number,
    public readonly shippingCoordinates: Coordinates,
    public readonly quantity: Quantity,
    public readonly unitPriceAtTime: Money,
    public readonly discount: Discount,
    public readonly shippingCost: Money,
    public readonly totalPrice: Money,
    public status: OrderStatus,
  ) {}

  static create(
    shippingCoordinates: Coordinates,
    quantity: Quantity,
    unitPriceAtTime: Money,
    discount: Discount,
    shippingCost: Money,
  ): Order {
    const subtotal = unitPriceAtTime.multiply(quantity.value);
    const discountAmount = subtotal.applyPercentage(discount.percentage);
    const totalPrice = subtotal.subtract(discountAmount).add(shippingCost);

    return new Order(
      crypto.randomUUID(),
      0,
      shippingCoordinates,
      quantity,
      unitPriceAtTime,
      discount,
      shippingCost,
      totalPrice,
      OrderStatus.PENDING,
    );
  }

  setOrderNumber(orderNumber: number): void {
    this.orderNumber = orderNumber;
  }

  submit(): void {
    this.status = OrderStatus.SUBMITTED;
  }

  isValid(maxShippingPercentage: number): boolean {
    const subtotal = this.unitPriceAtTime.multiply(this.quantity.value);
    const discountAmount = subtotal.applyPercentage(this.discount.percentage);
    const orderAmount = subtotal.subtract(discountAmount);
    const maxShippingCost = orderAmount.applyPercentage(maxShippingPercentage);
    return this.shippingCost.lessThanOrEqual(maxShippingCost);
  }
}
