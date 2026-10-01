import { MenuDomainError } from "../errors/menu-domain.error.js"

export type Currency = "INR"

export class Money {

  private readonly amount: number
  private readonly currency: Currency

  constructor(amount: number, currency: Currency) {
    this.amount = amount
    this.currency = currency
  }

  public static create(amount: number, currency: Currency = "INR"): Money {
    Money.validateAmount(amount)

    return new Money(amount, currency)
  }

  private static validateAmount(amount: number): void {
    if (!Number.isSafeInteger(amount)) {
      throw new MenuDomainError("Money amount must be a safe integer", 400)
    }

    if (amount < 0) {
      throw new MenuDomainError("Money amount cannot be negative", 400)
    }
  }

  private ensureSameCurrency(value: Money): void {
    if (this.currency !== value.currency) {
      throw new MenuDomainError(`Currency mismatch: ${this.currency} and ${value.currency}`, 400)
    }
  }

  public getAmount(): number {
    return this.amount
  }

  public add(value: Money): Money {
    this.ensureSameCurrency(value)

    const result = this.amount + value.amount

    Money.validateAmount(result)

    return Money.create(result, this.currency)
  }

  public subtract(value: Money): Money {
    this.ensureSameCurrency(value)

    const result = this.amount - value.amount

    Money.validateAmount(result)

    return Money.create(result, this.currency)
  }

  public isGreaterThan(value: Money): boolean {
    this.ensureSameCurrency(value)

    return this.amount > value.amount
  }

  public isLessThan(value: Money): boolean {
    this.ensureSameCurrency(value)

    return this.amount < value.amount
  }

  public equals(other: Money): boolean {
    return (
      this.amount === other.amount &&
      this.currency === other.currency
    )
  }

  public toJSON(): {
    amount: number;
    currency: Currency
  } {
    return {
      amount: this.amount,
      currency: this.currency
    }
  }

  public toString(): string {
    return `${this.amount} ${this.currency}`
  }
}
