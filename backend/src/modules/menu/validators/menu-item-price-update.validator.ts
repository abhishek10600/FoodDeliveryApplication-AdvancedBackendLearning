import { z } from "zod"

export const menuItemPriceUpdateSchema = z.object({
  price: z.int().min(0, "Menu item price cannot be negative")
}).strict()

export type MenuItemPriceUpdateInput = z.infer<typeof menuItemPriceUpdateSchema>
