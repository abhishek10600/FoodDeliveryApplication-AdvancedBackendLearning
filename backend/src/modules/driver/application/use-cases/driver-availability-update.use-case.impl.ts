import { injectable, inject } from "tsyringe"
import { DriverAvailabilityUpdateUseCase } from "./driver-availability-update.use-case.js";
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { IDriverRepository } from "../../domain/repositories/driver.repository.js";
import { DriverStatusUpdateInput } from "../dto/driver-status-update.dto.js";
import { DriverDomainError } from "../../domain/errors/driver-domain.error.js";

@injectable()
export class DriverAvailabilityUpdateUseCaseImpl implements DriverAvailabilityUpdateUseCase {
  constructor(

    @inject(DriverTokens.DriverRepository)
    private readonly driverRepo: IDriverRepository

  ) { }

  async execute(input: DriverStatusUpdateInput): Promise<void> {
    const driverProfile = await this.driverRepo.findByUserId(input.driverUserId)

    if (!driverProfile) {
      throw new DriverDomainError("Driver not found", 404)
    }

    driverProfile.updateAvailability()

    await this.driverRepo.update(driverProfile.getId(), driverProfile)
  }
}
