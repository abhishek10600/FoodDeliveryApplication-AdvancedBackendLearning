import { z } from "zod"

export const updateMenuCategoryParamsSchema = z.object({
  restaurantId: z.uuid(),
  categoryId: z.uuid()
}).strict()

export type UpdateMenuCategoryParamsSchema = z.infer<typeof updateMenuCategoryParamsSchema>
