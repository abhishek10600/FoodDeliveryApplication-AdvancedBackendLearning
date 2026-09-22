import { z } from "zod"

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format")

export const restaurantOpeningHoursUpdateSchema = z.object({
  dayOfWeek: z.int().min(0, "Day of week cannot be less than 0").max(6, "Day of week must be between 0-6"),
  opensAt: timeSchema.nullable(),
  closesAt: timeSchema.nullable(),
  isClosed: z.boolean()
}).strict()

export const restaurantOpeningHoursUpdateParamsSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant id is required")
}).strict()

export type RestaurantOpeningHoursUpdateInput = z.infer<typeof restaurantOpeningHoursUpdateSchema>
export type RestaurantOpeningHoursUpdateParamsInput = z.infer<typeof restaurantOpeningHoursUpdateParamsSchema>
