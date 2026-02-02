import { describe, expect, test } from "bun:test";
import { Warehouse } from "../entities/warehouse.entity";
import { Coordinates } from "../value-objects/coordinates.vo";
import { type FulfillmentPlan, ShippingCalculatorDomainService } from "./shipping-calculator.domain-service";

describe("ShippingCalculatorDomainService", () => {
  describe("calculateShippingCost", () => {
    test("calculates shipping cost: distance × quantity × 0.365kg × $0.01", () => {
      // 1000 km × 100 units × 0.365 kg × $0.01 = $365.00
      const cost = ShippingCalculatorDomainService.calculateShippingCost(1000, 100);
      expect(cost.toDollars()).toBe(365);
    });

    test("handles single unit", () => {
      // 1000 km × 1 unit × 0.365 kg × $0.01 = $3.65
      const cost = ShippingCalculatorDomainService.calculateShippingCost(1000, 1);
      expect(cost.toDollars()).toBe(3.65);
    });
  });

  describe("calculateOptimalFulfillment", () => {
    const losAngeles = new Warehouse(
      "la",
      "Los Angeles",
      Coordinates.fromObject({ latitude: 33.9425, longitude: -118.408056 }),
      355,
    );
    const newYork = new Warehouse(
      "ny",
      "New York",
      Coordinates.fromObject({ latitude: 40.639722, longitude: -73.778889 }),
      578,
    );

    test("fulfills from single warehouse when sufficient stock", () => {
      const destination = Coordinates.fromObject({ latitude: 34.05, longitude: -118.25 });
      const plans = ShippingCalculatorDomainService.calculateOptimalFulfillment([losAngeles], destination, 100);

      expect(plans).toHaveLength(1);
      expect(plans[0]?.warehouseId).toBe("la");
      expect(plans[0]?.quantity).toBe(100);
    });

    test("prioritizes closest warehouse for multi-source fulfillment", () => {
      // Destination near Los Angeles
      const destination = Coordinates.fromObject({ latitude: 34.05, longitude: -118.25 });

      // Request 400 units - LA has 355, NY has 578
      const plans = ShippingCalculatorDomainService.calculateOptimalFulfillment(
        [losAngeles, newYork],
        destination,
        400,
      );

      expect(plans).toHaveLength(2);
      // LA (closest) should fulfill first
      expect(plans[0]?.warehouseId).toBe("la");
      expect(plans[0]?.quantity).toBe(355);
      // NY fulfills the rest
      expect(plans[1]?.warehouseId).toBe("ny");
      expect(plans[1]?.quantity).toBe(45);
    });

    test("throws error when insufficient stock across all warehouses", () => {
      const destination = Coordinates.fromObject({ latitude: 34.05, longitude: -118.25 });

      expect(() => {
        ShippingCalculatorDomainService.calculateOptimalFulfillment(
          [losAngeles],
          destination,
          400, // More than LA's 355 stock
        );
      }).toThrow("Insufficient stock across all warehouses");
    });
  });

  describe("calculateTotalShippingCost", () => {
    test("sums shipping costs from all fulfillment plans", () => {
      const plans: FulfillmentPlan[] = [
        {
          warehouseId: "la",
          warehouseName: "Los Angeles",
          quantity: 100,
          distance: 1000,
          shippingCost: ShippingCalculatorDomainService.calculateShippingCost(1000, 100),
        },
        {
          warehouseId: "ny",
          warehouseName: "New York",
          quantity: 50,
          distance: 500,
          shippingCost: ShippingCalculatorDomainService.calculateShippingCost(500, 50),
        },
      ];

      const total = ShippingCalculatorDomainService.calculateTotalShippingCost(plans);
      // 1000 × 100 × 0.365 × 0.01 + 500 × 50 × 0.365 × 0.01
      // = 365 + 91.25 = 456.25
      expect(total.toDollars()).toBe(456.25);
    });
  });
});
