import { injectable, inject } from "tsyringe"
import { IDriverVehicleRepository } from "../../../domain/repositories/driver-vehicle.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { DriverVehicle } from "../../../domain/entities/driver-vehicle.entity.js";
import { DriverVehicleMapper } from "./mappers/driver-vehicle.mapper.js";

@injectable()
export class DriverVehicleRepository implements IDriverVehicleRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<DriverVehicle | null> {
    const driverVehicle = await this.prisma.driverVehicle.findUnique({
      where: {
        id
      }
    })

    if (!driverVehicle) {
      return null
    }

    return DriverVehicleMapper.toDomain(driverVehicle)
  }

  async findByDriverId(driverId: string): Promise<DriverVehicle | null> {
    const driverVehicle = await this.prisma.driverVehicle.findUnique({
      where: {
        driverId
      }
    })

    if (!driverVehicle) {
      return null
    }

    return DriverVehicleMapper.toDomain(driverVehicle)
  }

  async create(driverVehicle: DriverVehicle): Promise<DriverVehicle> {
    const data = DriverVehicleMapper.toPersistence(driverVehicle)

    const newDriverVehicle = await this.prisma.driverVehicle.create({
      data
    })

    return DriverVehicleMapper.toDomain(newDriverVehicle)
  }

  async update(id: string, driverVehicle: DriverVehicle): Promise<void> {
    const data = DriverVehicleMapper.toUpdatePersistence(driverVehicle)

    await this.prisma.driverVehicle.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id): Promise<void> {
    await this.prisma.driverVehicle.delete({
      where: {
        id
      }
    })
  }
}
