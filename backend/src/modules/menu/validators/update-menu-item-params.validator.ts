import { z } from "zod"

export const updateMenuItemParamsSchema = z.object({
  restaurantId: z.uuid(),
  categoryId: z.uuid(),
  menuItemId: z.uuid()
}).strict()

export type UpdateMenuItemParamsInput = z.infer<typeof updateMenuItemParamsSchema>
