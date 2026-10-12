import { z } from "zod"

export const menuCategoryByIdParamsSchema = z.object({
  categoryId: z.uuid()
}).strict()

export type MenuCategoryByIdParamsInput = z.infer<typeof menuCategoryByIdParamsSchema>
