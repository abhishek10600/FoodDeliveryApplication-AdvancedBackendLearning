import { injectable, inject } from "tsyringe"
import { IDriverRepository } from "../../../domain/repositories/driver.repository.js";
import { DriverProfile } from "../../../domain/entities/driver-profile.entity.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { DriverProfileMapper } from "./mappers/driver-profile.mapper.js";

@injectable()
export class DriverRepository implements IDriverRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<DriverProfile | null> {
    const driver = await this.prisma.driver.findUnique({
      where: {
        id
      }
    })

    if (!driver) {
      return null
    }

    return DriverProfileMapper.toDomain(driver)
  }

  async create(driver: DriverProfile): Promise<DriverProfile> {
    const data = DriverProfileMapper.toPersistence(driver)

    const newDriver = await this.prisma.driver.create({
      data
    })

    return DriverProfileMapper.toDomain(newDriver)
  }

  async update(id: string, driver: DriverProfile): Promise<void> {
    const data = DriverProfileMapper.toUpdatePersistence(driver)

    await this.prisma.driver.update({
      where: {
        id,
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.driver.delete({
      where: {
        id
      }
    })
  }
}
