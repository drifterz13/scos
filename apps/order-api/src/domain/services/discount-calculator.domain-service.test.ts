import { describe, expect, test } from "bun:test";
import { DiscountCalculatorDomainService } from "./discount-calculator.domain-service";

describe("DiscountCalculatorDomainService", () => {
  describe("calculate", () => {
    test("no discount for small orders (quantity < 25)", () => {
      const discount = DiscountCalculatorDomainService.calculate(24);
      expect(discount.percentage).toBe(0);
    });

    test("5% discount at threshold (quantity = 25)", () => {
      const discount = DiscountCalculatorDomainService.calculate(25);
      expect(discount.percentage).toBe(5);
    });

    test("5% discount below next threshold (quantity = 49)", () => {
      const discount = DiscountCalculatorDomainService.calculate(49);
      expect(discount.percentage).toBe(5);
    });

    test("10% discount at threshold (quantity = 50)", () => {
      const discount = DiscountCalculatorDomainService.calculate(50);
      expect(discount.percentage).toBe(10);
    });

    test("10% discount below next threshold (quantity = 99)", () => {
      const discount = DiscountCalculatorDomainService.calculate(99);
      expect(discount.percentage).toBe(10);
    });

    test("15% discount at threshold (quantity = 100)", () => {
      const discount = DiscountCalculatorDomainService.calculate(100);
      expect(discount.percentage).toBe(15);
    });

    test("15% discount below next threshold (quantity = 249)", () => {
      const discount = DiscountCalculatorDomainService.calculate(249);
      expect(discount.percentage).toBe(15);
    });

    test("20% discount at threshold (quantity = 250)", () => {
      const discount = DiscountCalculatorDomainService.calculate(250);
      expect(discount.percentage).toBe(20);
    });

    test("20% discount above threshold (quantity = 300)", () => {
      const discount = DiscountCalculatorDomainService.calculate(300);
      expect(discount.percentage).toBe(20);
    });
  });
});
