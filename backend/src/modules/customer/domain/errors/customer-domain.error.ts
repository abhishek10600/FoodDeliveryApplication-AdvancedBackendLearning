export class CustomerDomainError extends Error {
  constructor(message: string) {
    super(message)

    this.name = "CustomerDomainError"

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
