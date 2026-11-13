import { injectable } from "tsyringe"
import { InboxRepository } from "./inbox.repository.js";
import { ProcessedEventInput } from "./inbox.types.js";
import { prisma } from "../../database/prisma.js";

@injectable()
export class InboxProcessor {

  constructor(
    private readonly repository: InboxRepository
  ) { }

  async process<T>(
    input: ProcessedEventInput, handler: (
      tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
    ) => Promise<T>): Promise<{
      processed: boolean
      result?: T
    }> {
    return prisma.$transaction(async (tx) => {
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
