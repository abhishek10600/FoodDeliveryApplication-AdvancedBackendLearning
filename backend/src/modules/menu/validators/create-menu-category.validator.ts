import { z } from "zod"

export const createMenuCategorySchema = z.object({
  name: z.string().min(1, "Category name cannot be empty").max(100, "Category name cannot be more than 100 characters"),

  description: z.string().max(500, "Category description cannot be more than 500 characters").optional()
}).strict()

export type CreateMenuCategoryInput = z.infer<typeof createMenuCategorySchema>
