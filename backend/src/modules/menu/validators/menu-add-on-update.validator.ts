import { z } from "zod"

export const menuAddOnUpdateSchema = z.object({
  name: z.string().trim().min(1, "menu add on name cannot be empty").max(100, "menu add on name cannot contain more than 100 characters").optional(),

  price: z.int().min(0, "menu add on price cannot be negative").optional(),

  currency: z.enum(["INR", "USD"]).optional(),

  displayOrder: z.int().min(0, "menu add on display order cannot be negative").optional()
}).strict()

export type MenuAddOnUpdateInput = z.infer<typeof menuAddOnUpdateSchema>
