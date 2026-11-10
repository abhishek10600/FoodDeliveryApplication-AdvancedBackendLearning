import { z } from "zod"
import type { EventDefinition } from "../event-definition.js"

export const UserRegisteredPayloadSchema = z.object({
  userId: z.uuid(),
  email: z.email(),
  roles: z.array(z.enum(["ADMIN", "CUSTOMER", "DRIVER", "RESTAURANT_OWNER"]))
}).strict()

export type UserRegisteredPayload = z.infer<typeof UserRegisteredPayloadSchema>

export const UserRegisteredV1: EventDefinition<UserRegisteredPayload> = {
  eventType: "identity.user-registered",
  eventVersion: 1,
  payloadSchema: UserRegisteredPayloadSchema
}
