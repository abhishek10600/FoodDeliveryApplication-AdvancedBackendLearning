import { injectable, inject } from "tsyringe";
import { IdentityTransactionContext, IIdentityTransaction } from "../../../application/transaction/identity.transaction.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import { UserRepository } from "./user.repository.js";
import { RefreshSessionRepository } from "./refresh-session.repository.js";
import { PrismaClient } from "../../../../../../generated/prisma/client.js";

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

      return operation({
        userRepository,
        refreshSessionRepository
      })
    })
  }
}
