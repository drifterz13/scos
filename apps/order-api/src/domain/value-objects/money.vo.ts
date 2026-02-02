export class Money {
  private static readonly CENTS_IN_DOLLAR = 100;

  private constructor(public readonly amount: number) {
    if (amount < 0) throw new Error("Money amount cannot be negative");
  }

  static fromDollars(dollars: number): Money {
    return new Money(Math.round(dollars * Money.CENTS_IN_DOLLAR));
  }

  toDollars(): number {
    return this.amount / Money.CENTS_IN_DOLLAR;
  }

  toCents(): number {
    return this.amount;
  }

  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return new Money(this.amount - other.amount);
  }

  multiply(multiplier: number): Money {
    return new Money(Math.round(this.amount * multiplier));
  }

  applyPercentage(percentage: number): Money {
    return new Money(Math.round((this.amount * percentage) / 100));
  }

  lessThanOrEqual(other: Money): boolean {
    return this.amount <= other.amount;
  }
}
