export const DriverTokens = {
  DriverRepository: Symbol.for("Driver.DriverRepositorys"),
  DriverVehicleRepository: Symbol.for("Driver.DriverVehicleRepository"),

  DriverRegisterUseCase: Symbol.for("Driver.DriverRegisterUseCase"),
  DriverProfileUseCase: Symbol.for("Driver.DriverProfileUseCase"),
  DriverProfileUpdateUseCase: Symbol.for("Driver.DriverProfileUpdateUseCase"),
  DriverAvailabilityUpdateUseCase: Symbol.for("Driver.DriverAvailabilityUpdateUseCase"),
} as const
