import { z } from "zod"
import type { EventDefinition } from "../event-definition.js"

export const PaymentFailedPayloadSchema = z.object({

  paymentId: z.uuid(),
  orderId: z.uuid(),
  amount: z.int(),
  currency: z.string(),
  provider: z.string(),
  failureCode: z.string(),
  failureMessage: z.string(),
  processedAt: z.string()

}).strict()

export type PaymentFailedPayload = z.infer<typeof PaymentFailedPayloadSchema>

export const PaymentFailedV1: EventDefinition<PaymentFailedPayload> = {
  eventType: "payment.payment-failed",
  eventVersion: 1,
  payloadSchema: PaymentFailedPayloadSchema
}
