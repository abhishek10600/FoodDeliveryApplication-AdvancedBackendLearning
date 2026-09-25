import { z } from "zod"

export const restaurantCuisineStatusUpdateParamsSchema = z.object({
  restaurantId: z.uuid(),
  cuisineId: z.uuid()
}).strict()

export type RestaurantCuisineStatusUpdateParamsInput = z.infer<typeof restaurantCuisineStatusUpdateParamsSchema>
