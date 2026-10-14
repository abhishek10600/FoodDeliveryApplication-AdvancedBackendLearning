import { z } from "zod"

export const updateMenuCategoryDescriptionSchema = z.object({
  menuCategoryDescription: z.string().trim().min(1, "Menu category description cannot be empty").max(500, "Menu category description cannot be more than 500 characters")
}).strict()

export type UpdateMenuCategoryDescriptionInput = z.infer<typeof updateMenuCategoryDescriptionSchema>
