import { injectable, inject } from "tsyringe"
import { IDriverRepository } from "../../../domain/repositories/driver.repository.js";
import { Driver } from "../../../domain/entities/driver.entity.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";

@injectable()
export class DriverRepository implements IDriverRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async create(drive: Driver): Promise<Driver> {
    
  }
}
