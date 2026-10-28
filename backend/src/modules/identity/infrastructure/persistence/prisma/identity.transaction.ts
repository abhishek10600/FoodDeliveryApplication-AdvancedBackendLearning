import { injectable, inject } from "tsyringe";
import { IdentityTransactionContext, IIdentityTransaction } from "../../../application/transaction/identity.transaction.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import { UserRepository } from "./user.repository.js";
import { RefreshSessionRepository } from "./refresh-session.repository.js";
import { PrismaClient } from "../../../../../../generated/prisma/client.js";
import { CustomerRepository } from "../../../../customer/infrastructure/persistence/prisma/customer.respository.js";
import { DriverRepository } from "../../../../driver/infrastructure/persistence/prisma/driver.repository.js";
import { DriverVehicleRepository } from "../../../../driver/infrastructure/persistence/prisma/driver-vehicle.repository.js";

@injectable()
export class IdentityTransaction implements IIdentityTransaction {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient

  ) { }

  async execute<T>(operation: (context: IdentityTransactionContext) => Promise<T>): Promise<T> {

    return this.prisma.$transaction(async (tx) => {
      const userRepository = new UserRepository(tx)
      const refreshSessionRepository = new RefreshSessionRepository(tx)
      const customerRepository = new CustomerRepository(tx)
      const driverRepository = new DriverRepository(tx)
      const driverVehicleRepository = new DriverVehicleRepository(tx)

      return operation({
        userRepository,
        refreshSessionRepository,
        customerRepository,
        driverRepository,
        driverVehicleRepository
      })
    })
  }
}
