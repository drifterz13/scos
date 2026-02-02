import { describe, expect, test } from "bun:test";
import { Discount } from "./discount.vo";

describe("Discount", () => {
  describe("constructor", () => {
    test("creates valid discount", () => {
      const discount = new Discount(10);
      expect(discount.percentage).toBe(10);
    });

    test("throws error for percentage > 100", () => {
      expect(() => new Discount(101)).toThrow("Invalid discount percentage");
    });

    test("throws error for percentage < 0", () => {
      expect(() => new Discount(-1)).toThrow("Invalid discount percentage");
    });

    test("accepts boundary values", () => {
      const discount1 = new Discount(0);
      expect(discount1.percentage).toBe(0);

      const discount2 = new Discount(100);
      expect(discount2.percentage).toBe(100);
    });
  });
});
