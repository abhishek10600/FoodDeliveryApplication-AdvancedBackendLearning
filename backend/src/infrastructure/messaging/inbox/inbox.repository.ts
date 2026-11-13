import { injectable } from "tsyringe"
import { InboxTransactionClient, ProcessedEventInput } from "./inbox.types.js";

@injectable()
export class InboxRepository {

  async exists(input: ProcessedEventInput, tx: InboxTransactionClient): Promise<boolean> {

    const processed = await tx.processedEvent.findUnique({
      where: {
        consumerName_eventId: {
          consumerName: input.consumerName,
          eventId: input.eventId
        }
      },
      select: {
        id: true
      }
    })

    return processed !== null
  }

  async markProcessed(input: ProcessedEventInput, tx: InboxTransactionClient): Promise<void> {
    await tx.processedEvent.create({
      data: {
        consumerName: input.consumerName,
        eventId: input.eventId
      }
    })
  }
}
