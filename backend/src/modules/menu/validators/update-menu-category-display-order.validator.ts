import { z } from "zod"

export const updateMenuCategoryDisplayOrderSchema = z.object({
  displayOrder: z.int().min(0, "display order cannot be less than 0")
}).strict()

export type UpdateMenuCategoryDisplayOrderInput = z.infer<typeof updateMenuCategoryDisplayOrderSchema>
