import { injectable, inject } from "tsyringe"
import { DriverProfileUpdateUseCase } from "./driver-profile-update.use-case.js";
import { DriverTokens } from "../../infrastructure/persistence/tokens/driver.tokens.js";
import type { IDriverRepository } from "../../domain/repositories/driver.repository.js";
import { DriverProfileUpdateInput } from "../dto/driver-profile-update.dto.js";
import { DriverDomainError } from "../../domain/errors/driver-domain.error.js";
import { DriverFirstName } from "../../domain/value-objects/driver-first-name.vo.js";
import { DriverLastName } from "../../domain/value-objects/driver-last-name.vo.js";
import { DriverPhone } from "../../domain/value-objects/driver-phone.vo.js";

@injectable()
export class DriverProfileUpdateUseCaseImpl implements DriverProfileUpdateUseCase {
  constructor(

    @inject(DriverTokens.DriverRepository)
    private readonly driverRepo: IDriverRepository

  ) { }

  async execute(input: DriverProfileUpdateInput): Promise<void> {
    const driverProfile = await this.driverRepo.findByUserId(input.driverUserId)

    if (!driverProfile) {
      throw new DriverDomainError("Driver not found", 404)
    }

    if (input.firstName !== undefined) {
      driverProfile.update({
        firstName: DriverFirstName.create(input.firstName)
      })
    }

    if (input.lastName !== undefined) {
      driverProfile.update({
        lastName: DriverLastName.create(input.lastName)
      })
    }

    if (input.phone !== undefined) {
      driverProfile.update({
        phone: DriverPhone.create(input.phone)
      })
    }

    await this.driverRepo.update(driverProfile.getId(), driverProfile)
  }
}
