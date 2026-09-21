import { z } from "zod"

export const restaurantStatusUpdateParamsSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant id is required")
}).strict()

export type RestaurantStatusUpdateInput = z.infer<typeof restaurantStatusUpdateParamsSchema>
