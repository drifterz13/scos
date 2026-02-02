import { PRODUCT_CONSTANTS } from "../constants/product.constants";
import { Discount } from "../value-objects/discount.vo";

export class DiscountCalculatorDomainService {
  static calculate(quantity: number): Discount {
    // Find highest applicable discount
    const applicable = PRODUCT_CONSTANTS.VOLUME_DISCOUNTS.filter((d) => quantity >= d.threshold);

    if (applicable.length === 0) {
      return new Discount(0);
    }

    // Return highest discount (last in filtered array)
    const highest = applicable[applicable.length - 1]!;
    return new Discount(highest.percentage);
  }
}
