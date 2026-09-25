import { z } from "zod"

export const restaurantCuisineDeletionSchema = z.object({
  restaurantId: z.uuid(),
  cuisineId: z.uuid()
}).strict()

export type RestaurantCuisineDeletionInput = z.infer<typeof restaurantCuisineDeletionSchema>
