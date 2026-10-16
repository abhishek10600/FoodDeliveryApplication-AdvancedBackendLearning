import { z } from "zod"

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(1, "Menu item name cannot be empty").max(100, "Menu item name cannot contain more than 100 characters"),

  description: z.string().trim().max(500, "Menu item description cannot contain more than 500 characters").optional(),

  price: z.int().min(0, "Menu item price cannot be less than 0"),

  currency: z.enum(["INR", "USD", "EUR"])
}).strict()

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>
