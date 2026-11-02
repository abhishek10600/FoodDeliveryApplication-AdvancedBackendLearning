export const AddressTokens = {
  AddressRepository: Symbol.for("Address.AddressRepository"),

  AddressCreationUseCase: Symbol.for("Address.AddressCreationUseCase"),
  AddressByCustomerUseCase: Symbol.for("Address.AddressByCustomerUseCase"),
  AddressByIdUseCase: Symbol.for("Address.AddressByIdUseCase"),
} as const
