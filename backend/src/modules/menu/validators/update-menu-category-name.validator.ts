import { z } from "zod"

export const updateMenuCategoryNameSchema = z.object({
  menuCategoryName: z.string().trim().min(1, "Menu category name cannot be empty").max(100, "Menu category name cannot contain more than 100 characters")
})

export type UpdateMenuCategoryNameInput = z.infer<typeof updateMenuCategoryNameSchema>
