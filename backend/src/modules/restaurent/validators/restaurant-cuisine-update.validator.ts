import { z } from "zod"

export const restaurantCuisineUpdateSchema = z.object({
  cuisineName: z.string().min(1, "Cuisine name is required").max(100, "Cuisine name cannot contain more than 100 characters").trim().toLowerCase()
}).strict()

export const restaurantCuisineUpdatePramsSchema = z.object({
  restaurantId: z.uuid(),
  cuisineId: z.uuid()
}).strict()

export type RestaurantCuisineUpdateInput = z.infer<typeof restaurantCuisineUpdateSchema>
export type RestaurantCuisineUpdateParamsInput = z.infer<typeof restaurantCuisineUpdatePramsSchema>
