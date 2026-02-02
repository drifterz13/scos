import { describe, expect, test } from "bun:test";
import { Money } from "./money.vo";

describe("Money", () => {
  describe("fromDollars", () => {
    test("converts dollars to cents correctly", () => {
      const money = Money.fromDollars(100);
      expect(money.toCents()).toBe(10000);
    });

    test("handles fractional dollars", () => {
      const money = Money.fromDollars(100.5);
      expect(money.toCents()).toBe(10050);
    });

    test("rounds to nearest cent", () => {
      const money = Money.fromDollars(100.999);
      expect(money.toCents()).toBe(10100);
    });
  });

  describe("toDollars", () => {
    test("converts cents to dollars correctly", () => {
      const money = Money.fromCents(10000);
      expect(money.toDollars()).toBe(100);
    });

    test("handles fractional cents", () => {
      const money = Money.fromCents(10050);
      expect(money.toDollars()).toBe(100.5);
    });
  });

  describe("add", () => {
    test("adds two Money values", () => {
      const money1 = Money.fromDollars(100);
      const money2 = Money.fromDollars(50);
      const result = money1.add(money2);
      expect(result.toDollars()).toBe(150);
    });
  });

  describe("subtract", () => {
    test("subtracts two Money values", () => {
      const money1 = Money.fromDollars(100);
      const money2 = Money.fromDollars(50);
      const result = money1.subtract(money2);
      expect(result.toDollars()).toBe(50);
    });
  });

  describe("multiply", () => {
    test("multiplies Money by scalar", () => {
      const money = Money.fromDollars(100);
      const result = money.multiply(2);
      expect(result.toDollars()).toBe(200);
    });

    test("handles fractional multipliers", () => {
      const money = Money.fromDollars(100);
      const result = money.multiply(1.5);
      expect(result.toDollars()).toBe(150);
    });
  });

  describe("applyPercentage", () => {
    test("calculates percentage correctly", () => {
      const money = Money.fromDollars(100);
      const result = money.applyPercentage(10);
      expect(result.toDollars()).toBe(10);
    });

    test("handles fractional percentages", () => {
      const money = Money.fromDollars(100);
      const result = money.applyPercentage(15);
      expect(result.toDollars()).toBe(15);
    });
  });

  describe("lessThanOrEqual", () => {
    test("returns true when less than", () => {
      const money1 = Money.fromDollars(50);
      const money2 = Money.fromDollars(100);
      expect(money1.lessThanOrEqual(money2)).toBe(true);
    });

    test("returns true when equal", () => {
      const money1 = Money.fromDollars(100);
      const money2 = Money.fromDollars(100);
      expect(money1.lessThanOrEqual(money2)).toBe(true);
    });

    test("returns false when greater than", () => {
      const money1 = Money.fromDollars(100);
      const money2 = Money.fromDollars(50);
      expect(money1.lessThanOrEqual(money2)).toBe(false);
    });
  });

  describe("validation", () => {
    test("throws error for negative amounts", () => {
      expect(() => Money.fromCents(-100)).toThrow("Money amount cannot be negative");
    });
  });
});
