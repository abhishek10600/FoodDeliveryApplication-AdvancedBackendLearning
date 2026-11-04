export const AddressTokens = {
  AddressRepository: Symbol.for("Address.AddressRepository"),

  AddressCreationUseCase: Symbol.for("Address.AddressCreationUseCase"),
  AddressByCustomerUseCase: Symbol.for("Address.AddressByCustomerUseCase"),
  AddressByIdUseCase: Symbol.for("Address.AddressByIdUseCase"),
  AddressSetDefaultUseCase: Symbol.for("Address.AddressSetDefaultUseCase"),
  AddressUpdateUseCase: Symbol.for("Address.AddressUpdateUseCase"),
  AddressDeleteUseCase: Symbol.for("Address.AddressDeleteUseCase"),

} as const
