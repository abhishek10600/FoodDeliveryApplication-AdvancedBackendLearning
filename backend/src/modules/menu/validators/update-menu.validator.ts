import { z } from "zod"

export const updateMenuSchema = z.object({
  name: z.string().trim().min(1, "Menu name cannot be empty").max(100, "Menu name cannot contain more than 100 characters")
}).strict()

export type UpdateMenuInput = z.infer<typeof updateMenuSchema>
