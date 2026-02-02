import { describe, expect, test } from "bun:test";
import { Quantity } from "./quantity.vo";

describe("Quantity", () => {
  describe("constructor", () => {
    test("creates valid quantity", () => {
      const quantity = new Quantity(10);
      expect(quantity.value).toBe(10);
    });

    test("throws error for non-positive values", () => {
      expect(() => new Quantity(0)).toThrow("Quantity must be positive");
      expect(() => new Quantity(-1)).toThrow("Quantity must be positive");
    });

    test("throws error for non-integer values", () => {
      expect(() => new Quantity(10.5)).toThrow("Quantity must be an integer");
    });
  });
});
