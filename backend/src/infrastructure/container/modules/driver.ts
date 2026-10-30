import { container } from "tsyringe"
import { DriverTokens } from "../../../modules/driver/infrastructure/persistence/tokens/driver.tokens.js"
import { DriverRepository } from "../../../modules/driver/infrastructure/persistence/prisma/driver.repository.js"
import { DriverVehicleRepository } from "../../../modules/driver/infrastructure/persistence/prisma/driver-vehicle.repository.js"
import { DriverRegisterUseCaseImpl } from "../../../modules/driver/application/use-cases/register-driver.use-case.impl.js"
import { DriverProfileUseCaseImpl } from "../../../modules/driver/application/use-cases/driver-profile.use-case.impl.js"
import { DriverProfileUpdateUseCaseImpl } from "../../../modules/driver/application/use-cases/driver-profile-update.use-case.impl.js"
import { DriverAvailabilityUpdateUseCaseImpl } from "../../../modules/driver/application/use-cases/driver-availability-update.use-case.impl.js"

export const registerDriver = (): void => {

  container.register(DriverTokens.DriverRepository, {
    useClass: DriverRepository
  })

  container.register(DriverTokens.DriverVehicleRepository, {
    useClass: DriverVehicleRepository
  })

  container.registerSingleton(DriverTokens.DriverRegisterUseCase, DriverRegisterUseCaseImpl)

  container.registerSingleton(DriverTokens.DriverProfileUseCase, DriverProfileUseCaseImpl)

  container.registerSingleton(DriverTokens.DriverProfileUpdateUseCase, DriverProfileUpdateUseCaseImpl)

  container.registerSingleton(DriverTokens.DriverAvailabilityUpdateUseCase, DriverAvailabilityUpdateUseCaseImpl)

}
