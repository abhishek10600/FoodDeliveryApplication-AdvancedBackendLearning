import { z } from "zod"

export const restaurantByIdParamsSchema = z.object({
  restaurantId: z.uuid()
}).strict()

export type RestaurantByIdParamsSchemaInput = z.infer<typeof restaurantByIdParamsSchema>
