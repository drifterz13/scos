import type { SQL } from "bun";
import { Order, type OrderStatus } from "../../domain/entities/order.entity";
import type { IOrderRepository } from "../../domain/repositories/order.repository.interface";
import { Coordinates } from "../../domain/value-objects/coordinates.vo";
import { Discount } from "../../domain/value-objects/discount.vo";
import { Money } from "../../domain/value-objects/money.vo";
import { Quantity } from "../../domain/value-objects/quantity.vo";

export class OrderRepository implements IOrderRepository {
  constructor(private sql: SQL) {}

  async save(order: Order): Promise<Order> {
    const orderData = {
      id: order.id,
      order_number: order.orderNumber,
      shipping_latitude: order.shippingCoordinates.latitude,
      shipping_longitude: order.shippingCoordinates.longitude,
      quantity: order.quantity.value,
      unit_price_at_time: order.unitPriceAtTime.toDollars(),
      discount_percentage: order.discount.percentage,
      total_discount_amount: order.unitPriceAtTime
        .multiply(order.quantity.value)
        .applyPercentage(order.discount.percentage)
        .toDollars(),
      total_shipping_cost: order.shippingCost.toDollars(),
      total_price_final: order.totalPrice.toDollars(),
      status: order.status,
    };

    const [result] = await this.sql`INSERT INTO orders ${this.sql(orderData)} RETURNING *`;
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<Order | null> {
    const [result] = await this.sql`SELECT * FROM orders WHERE id = ${id}`;
    return result ? this.mapToEntity(result) : null;
  }

  async getNextOrderNumber(): Promise<number> {
    const [result] = await this.sql`SELECT COALESCE(MAX(order_number), 0) + 1 as next_number FROM orders`;
    return result.next_number;
  }

  private mapToEntity(row: {
    id: string;
    order_number: number;
    shipping_latitude: string;
    shipping_longitude: string;
    quantity: number;
    unit_price_at_time: number;
    discount_percentage: number;
    total_shipping_cost: number;
    total_price_final: number;
    status: string;
  }): Order {
    return new Order(
      row.id,
      row.order_number,
      Coordinates.fromObject({ latitude: +row.shipping_latitude, longitude: +row.shipping_longitude }),
      new Quantity(row.quantity),
      Money.fromDollars(row.unit_price_at_time),
      new Discount(row.discount_percentage),
      Money.fromDollars(row.total_shipping_cost),
      Money.fromDollars(row.total_price_final),
      row.status as OrderStatus,
    );
  }
}
