import { injectable, inject } from "tsyringe"
import { DriverProfileUseCase } from "./driver-profile.use-case.js";
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { IDriverRepository } from "../../domain/repositories/driver.repository.js";
import type { IDriverVehicleRepository } from "../../domain/repositories/driver-vehicle.repository.js";
import { DriverProfileResult } from "../dto/driver-profile-result.dto.js";
import { DriverProfileInput } from "../dto/driver-profile.dto.js";
import { DriverDomainError } from "../../domain/errors/driver-domain.error.js";
import { DriverResultMapper } from "../dto/mapper/driver.mapper.js";

@injectable()
export class DriverProfileUseCaseImpl implements DriverProfileUseCase {
  constructor(

    @inject(DriverTokens.DriverRepository)
    private readonly driverRepo: IDriverRepository,

    @inject(DriverTokens.DriverVehicleRepository)
    private readonly driverVehicleRepo: IDriverVehicleRepository

  ) { }

  async execute(input: DriverProfileInput): Promise<DriverProfileResult> {
    const driverProfile = await this.driverRepo.findByUserId(input.driverUserId)

    if (!driverProfile) {
      throw new DriverDomainError("Driver not found", 404)
    }

    const driverVehicle = await this.driverVehicleRepo.findByDriverId(driverProfile.getId())

    if (!driverVehicle) {
      throw new DriverDomainError("Driver vehicle not found", 404)
    }

    return DriverResultMapper.toResultWithVehicle(driverProfile, driverVehicle)
  }
}
