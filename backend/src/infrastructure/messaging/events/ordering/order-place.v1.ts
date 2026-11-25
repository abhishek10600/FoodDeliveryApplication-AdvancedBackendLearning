
import { z } from "zod";
import type { EventDefinition } from "../event-definition.js";

export const OrderPlacedPayloadSchema = z.object({
  orderId: z.uuid(),
  customerId: z.uuid(),
  restaurantId: z.uuid(),
  addressId: z.uuid(),

  items: z.array(
    z.object({
      menuItemId: z.uuid(),
      itemName: z.string(),
      unitPrice: z.number(),
      quantity: z.number().int().positive(),
      lineTotal: z.number()
    }).strict()
  ).min(1),

  subTotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  currency: z.string(),
  status: z.string(),
  createdAt: z.string()
}).strict();

export type OrderPlacedPayload = z.infer<
  typeof OrderPlacedPayloadSchema
>;

export const OrderPlacedV1: EventDefinition<OrderPlacedPayload> = {
  eventType: "order.placed",
  eventVersion: 1,
  payloadSchema: OrderPlacedPayloadSchema
};
