import type { z } from "zod"

export interface EventDefinition<TPayload> {
  eventType: string
  eventVersion: number
  payloadSchema: z.ZodType<TPayload>
}
