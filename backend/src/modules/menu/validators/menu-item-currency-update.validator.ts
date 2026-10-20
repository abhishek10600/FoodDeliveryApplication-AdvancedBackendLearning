import { z } from "zod"

export const menuItemCurrencyUpdateSchema = z.object({
  currency: z.enum(["INR", "USD"])
}).strict()

export type MenuItemCurrencyUpdateInput = z.infer<typeof menuItemCurrencyUpdateSchema>
