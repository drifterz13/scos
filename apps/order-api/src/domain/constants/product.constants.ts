import { Money } from "../value-objects/money.vo";

export const PRODUCT_CONSTANTS = {
  NAME: "SCOS Station P1 Pro",
  BASE_PRICE: Money.fromDollars(150),
  UNIT_WEIGHT_KG: 0.365,
  SHIPPING_RATE_PER_KG_PER_KM: 0.01,
  MAX_SHIPPING_COST_PERCENTAGE: 15,
  VOLUME_DISCOUNTS: [
    { threshold: 25, percentage: 5 },
    { threshold: 50, percentage: 10 },
    { threshold: 100, percentage: 15 },
    { threshold: 250, percentage: 20 },
  ] as const,
} as const;
