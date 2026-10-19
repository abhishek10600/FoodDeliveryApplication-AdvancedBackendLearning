import { z } from "zod"

export const updateMenuItemDescriptionSchema = z.object({
  description: z.string().trim().min(1, "Menu item description cannot be empty").max(500,"Menu item description cannot contain more than 500 characters")
})

export type UpdateMenuItemDescriptionInput = z.infer<typeof updateMenuItemDescriptionSchema>
