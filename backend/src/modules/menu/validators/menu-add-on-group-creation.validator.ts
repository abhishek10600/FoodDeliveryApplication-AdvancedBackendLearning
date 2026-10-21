import { z } from "zod"

export const menuAddOnGroupCreationSchema = z.object({
  name: z.string().trim().min(1, "Menu add on group name cannot be empty").max(100, "Menu add on group name cannot contain more than 100 characters")
}).strict()

export type MenuAddOnGroupCreationInput = z.infer<typeof menuAddOnGroupCreationSchema>
