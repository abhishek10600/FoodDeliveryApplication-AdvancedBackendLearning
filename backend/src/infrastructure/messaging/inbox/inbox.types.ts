import { Prisma } from "../../../../generated/prisma/client.js"

export type InboxTransactionClient = Prisma.TransactionClient

export interface ProcessedEventInput {

  consumerName: string
  eventId: string
}
