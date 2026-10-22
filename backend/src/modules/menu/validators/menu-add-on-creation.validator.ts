import { z } from "zod"

export const menuAddOnCreationSchema = z.object({
  name: z.string().trim().min(1, "Menu add on name cannot be empty").max(100, "Menu add on name cannot be more than 100 characters"),

  price: z.int().min(0, "Menu add on price cannot be negative"),

  currency: z.enum(["INR", "USD"])
}).strict()

export type MenuAddOnCreationInput = z.infer<typeof menuAddOnCreationSchema>
