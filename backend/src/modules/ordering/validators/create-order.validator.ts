import { z } from "zod"

export const MAX_ORDER_ITEM_QUANTITY = 99

const createOrderItemSchema = z.strictObject({
  menuItemId: z.uuid("Invalid menu item ID"),

  quantity: z.int().positive("Order quanity must be a postive number").max(MAX_ORDER_ITEM_QUANTITY, `Maximum quantity per item is ${MAX_ORDER_ITEM_QUANTITY}`)
})

export const createOrderSchema = z.strictObject({

  restaurantId: z.uuid("Invalid restaurantId"),

  addressId: z.uuid("Invalid address ID"),

  items: z.array(createOrderItemSchema).min(1, "An order must contain at least one item")
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>
