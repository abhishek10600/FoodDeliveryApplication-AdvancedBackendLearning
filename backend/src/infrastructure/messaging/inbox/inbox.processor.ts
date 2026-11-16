import { injectable, inject } from "tsyringe"
import { InboxRepository } from "./inbox.repository.js";
import { ProcessedEventInput } from "./inbox.types.js";
import { InfrastructureTokens } from "../../container/index.js";
import { PrismaClient, Prisma } from "../../../../generated/prisma/index.js";

@injectable()
export class InboxProcessor {

  constructor(
    private readonly repository: InboxRepository,

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient

  ) { }

  async process<T>(
    input: ProcessedEventInput, handler: (
      tx: Prisma.TransactionClient
    ) => Promise<T>): Promise<{
      processed: boolean
      result?: T
    }> {
    return this.prisma.$transaction(async (tx) => {
      const exists = await this.repository.exists(input, tx)

      if (exists) {
        return {
          processed: false
        }
      }

      const result = await handler(tx)

      await this.repository.markProcessed(input, tx)

      return {
        processed: true,
        result
      }
    },
      {
        isolationLevel: "Serializable",
        maxWait: 5000,
        timeout: 10000
      }
    )
    }
}
