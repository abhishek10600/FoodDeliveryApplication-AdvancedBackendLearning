import { z } from "zod"

export const restaurantCuisineCreationSchema = z.object({
  cuisineName: z.string().min(1, "Cuisine name is required").max(100, "Cuisine name cannot contain more than 100 characters").trim()
}).strict()

export const restaurantCuisineCreationParamsSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant id cannot be empty").trim()
})

export type RestaurantCuisineCreationInput = z.infer<typeof restaurantCuisineCreationSchema>
export type RestaurantCuisineCreationParamsInput = z.infer<typeof restaurantCuisineCreationParamsSchema>
