import { z } from "zod"

export const EventEnvelopeSchema = z.object({

  id: z.uuid(),
  eventType: z.string().min(1),
  eventVersion: z.number().int().positive(),
  occurredAt: z.iso.datetime(),
  producer: z.string().min(1),
  correlationId: z.string().min(1),
  causationId: z.string().nullable(),
  payload: z.unknown()

}).strict()
