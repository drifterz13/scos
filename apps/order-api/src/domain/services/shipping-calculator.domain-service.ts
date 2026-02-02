import { PRODUCT_CONSTANTS } from "../constants/product.constants";
import type { Warehouse } from "../entities/warehouse.entity";
import type { Coordinates } from "../value-objects/coordinates.vo";
import { Money } from "../value-objects/money.vo";

export interface FulfillmentPlan {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  distance: number;
  shippingCost: Money;
}

export class ShippingCalculatorDomainService {
  static calculateShippingCost(distanceKm: number, quantity: number): Money {
    const totalWeight = quantity * PRODUCT_CONSTANTS.UNIT_WEIGHT_KG;
    const cost = distanceKm * totalWeight * PRODUCT_CONSTANTS.SHIPPING_RATE_PER_KG_PER_KM;
    return Money.fromDollars(cost);
  }

  static calculateOptimalFulfillment(
    warehouses: Warehouse[],
    destination: Coordinates,
    requestedQuantity: number,
  ): FulfillmentPlan[] {
    // Sort warehouses by distance (closest first)
    const sortedByDistance = warehouses
      .filter((w) => w.canFulfill(requestedQuantity) || w.stockQuantity > 0)
      .map((w) => ({
        warehouse: w,
        distance: w.distanceTo(destination),
      }))
      .sort((a, b) => a.distance - b.distance);

    const plans: FulfillmentPlan[] = [];
    let remainingQuantity = requestedQuantity;

    for (const { warehouse, distance } of sortedByDistance) {
      if (remainingQuantity <= 0) break;

      const fulfillQuantity = Math.min(remainingQuantity, warehouse.stockQuantity);

      plans.push({
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        quantity: fulfillQuantity,
        distance,
        shippingCost: ShippingCalculatorDomainService.calculateShippingCost(distance, fulfillQuantity),
      });

      remainingQuantity -= fulfillQuantity;
    }

    if (remainingQuantity > 0) {
      throw new Error("Insufficient stock across all warehouses");
    }

    return plans;
  }

  static calculateTotalShippingCost(plans: FulfillmentPlan[]): Money {
    return plans.reduce((total, plan) => total.add(plan.shippingCost), Money.fromDollars(0));
  }
}
