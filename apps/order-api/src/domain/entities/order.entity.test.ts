import { describe, expect, test } from "bun:test";
import { Coordinates } from "../value-objects/coordinates.vo";
import { Discount } from "../value-objects/discount.vo";
import { Money } from "../value-objects/money.vo";
import { Quantity } from "../value-objects/quantity.vo";
import { Order, OrderStatus } from "./order.entity";

describe("Order", () => {
  const coords = Coordinates.fromObject({ latitude: 40.7128, longitude: -74.006 });
  const quantity = new Quantity(10);
  const unitPrice = Money.fromDollars(150);
  const discount = new Discount(10);
  const shippingCost = Money.fromDollars(50);

  describe("create", () => {
    test("creates order with calculated total price", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);

      expect(order.id).toBeDefined();
      expect(order.orderNumber).toBe(0);
      expect(order.shippingCoordinates).toEqual(coords);
      expect(order.quantity).toEqual(quantity);
      expect(order.unitPriceAtTime).toEqual(unitPrice);
      expect(order.discount).toEqual(discount);
      expect(order.shippingCost).toEqual(shippingCost);
      expect(order.status).toBe(OrderStatus.PENDING);

      // Total price = (150 * 10) - 10% + 50 = 1500 - 150 + 50 = 1400
      expect(order.totalPrice.toDollars()).toBe(1400);
    });

    test("generates UUID for id", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);
      expect(order.id).toMatch(/^[0-9a-f-]{36}$/);
    });
  });

  describe("setOrderNumber", () => {
    test("sets order number", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);
      order.setOrderNumber(123);
      expect(order.orderNumber).toBe(123);
    });
  });

  describe("submit", () => {
    test("changes status to SUBMITTED", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, shippingCost);
      expect(order.status).toBe(OrderStatus.PENDING);
      order.submit();
      expect(order.status).toBe(OrderStatus.SUBMITTED);
    });
  });

  describe("isValid", () => {
    // Order amount = $1500 - $150 (10% discount) = $1350
    // Max shipping cost = 15% of $1350 = $202.50
    const validShippingCost = Money.fromDollars(200); // Below threshold
    const invalidShippingCost = Money.fromDollars(203); // Above threshold

    test("returns true when shipping <= 15% of order amount", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, validShippingCost);
      expect(order.isValid(15)).toBe(true);
    });

    test("returns false when shipping > 15% of order amount", () => {
      const order = Order.create(coords, quantity, unitPrice, discount, invalidShippingCost);
      expect(order.isValid(15)).toBe(false);
    });
  });
});
