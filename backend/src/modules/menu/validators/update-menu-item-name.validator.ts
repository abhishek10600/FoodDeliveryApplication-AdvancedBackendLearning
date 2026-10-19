import { z } from "zod"

export const updateMenuItemNameSchema = z.object({
  name: z.string().trim().min(1, "Menu item name cannot be empty").max(100, "Menu item name cannot contain more than 100 characters")
}).strict()

export type UpdateMenuItemNameInput = z.infer<typeof updateMenuItemNameSchema>
