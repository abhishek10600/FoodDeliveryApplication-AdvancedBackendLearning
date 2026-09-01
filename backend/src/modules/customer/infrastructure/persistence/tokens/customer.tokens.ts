export const CustomerTokens = {
  CustomerRepository: Symbol.for("Customer.CustomerRepository"),
  CustomerProfileCreationUseCase: Symbol.for("Customer.CustomerProfileCreationUseCase"),
  GetCustomerProfileUseCase: Symbol.for("Customer.GetCustomerProfileUseCase"),
  CustomerProfileUpdateUseCase: Symbol.for("Customer.CustomerProfileUpdateUseCase")

} as const
