import { z } from "zod"
import type { EventDefinition } from "../event-definition.js"

export const PaymentSucceededPayloadSchema = z.object({

  paymentId: z.uuid(),
  orderId: z.uuid(),
  amount: z.int(),
  currency: z.string(),
  provider: z.string(),
  providerRef: z.string(),
  processedAt: z.string()

}).strict()

export type PaymentSucceededPayload = z.infer<typeof PaymentSucceededPayloadSchema>

export const PaymentSucceededV1: EventDefinition<PaymentSucceededPayload> = {
  eventType: "payment.payment-succeeded",
  eventVersion: 1,
  payloadSchema: PaymentSucceededPayloadSchema
}
