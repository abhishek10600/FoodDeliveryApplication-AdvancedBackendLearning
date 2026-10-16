import { z } from "zod"

export const menuItemCategoryParamsSchema = z.object({
  restaurantId: z.uuid(),
  categoryId: z.uuid()
}).strict()

export type MenuItemCategoryPramsInput = z.infer<typeof menuItemCategoryParamsSchema>
