import { z } from "zod";

export const restaurantListQuerySchema = z.object({
  cuisine: z.string().trim().min(1).max(100).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
  cursor: z.string().trim().min(1).optional(),
  sortBy: z.enum(["name"]).default("name"),
})

export type RestaurantListQuery = z.infer<typeof restaurantListQuerySchema>
