import { Prisma } from "../../../../../../generated/prisma/client.js"
import { OrderItem } from "../../../domain/entities/order-item.entity.js";
import { Order } from "../../../domain/entities/order.entity.js";
import { OrderStatus } from "../../../domain/enums/order-status.enum.js";

export const orderInclude = {
  items: true
} satisfies Prisma.OrderInclude

export type PrismaOrderWithItems = Prisma.OrderGetPayload<{
  include: typeof orderInclude
}>

export class OrderMapper {

  public static toDomain(orderWithItems: PrismaOrderWithItems): Order {

    const items = orderWithItems.items.map((item) => OrderItem.rehydrate({
      id: item.id,
      orderId: item.orderId,
      menuItemId: item.menuItemId,
      itemName: item.itemName,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
      lineTotal: Number(item.lineTotal),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt

    }))

    return Order.rehydrate({
      id: orderWithItems.id,
      customerId: orderWithItems.customerId,
      restaurantId: orderWithItems.restaurantId,
      items,
      idempotencyKey: orderWithItems.idempotencyKey,
      addressId: orderWithItems.addressId,
      status: orderWithItems.status as OrderStatus,
      subTotal: Number(orderWithItems.subTotal),
      currency: orderWithItems.currency,
      deliveryFee: Number(orderWithItems.deliveryFee),
      total: Number(orderWithItems.total),
      createdAt: orderWithItems.createdAt,
      updatedAt: orderWithItems.updatedAt
    })
  }

  public static toPersistence(order: Order): Prisma.OrderCreateInput {
    return {
      id: order.getId(),
      customer: {
        connect: {
          id: order.getCustomerId()
        }
      },
      restaurant: {
        connect: {
          id: order.getRestaurantId()
        }
      },
      address: {
        connect: {
          id: order.getAddressId()
        }
      },
      items: {
        create: order.getItems().map((item) => ({
          id: item.getId(),
          MenuItem: {
            connect: {
              id: item.getMenuItemId()
            }
          },
          itemName: item.getItemName(),
          unitPrice: item.getUnitPrice(),
          quantity: item.getQuantity(),
          lineTotal: item.getLineTotal()
        }))
      },
      idempotencyKey: order.getIdempotencyKey(),
      status: order.getStatus(),
      subTotal: order.getSubTotal(),
      currency: order.getCurrency(),
      deliveryFee: order.getDeliveryFee(),
      total: order.getTotal(),
    }
  }

  public static toUpdatePersistence(order: Order): Prisma.OrderUpdateInput{
    return {
      id: order.getId(),
      customer: {
        connect: {
          id: order.getCustomerId()
        }
      },
      restaurant: {
        connect: {
          id: order.getRestaurantId()
        }
      },
      address: {
        connect: {
          id: order.getAddressId()
        }
      },
      items: {
        create: order.getItems().map((item) => ({
          id: item.getId(),
          MenuItem: {
            connect: {
              id: item.getMenuItemId()
            }
          },
          itemName: item.getItemName(),
          unitPrice: item.getUnitPrice(),
          quantity: item.getQuantity(),
          lineTotal: item.getLineTotal()
        }))
      },
      status: order.getStatus(),
      subTotal: order.getSubTotal(),
      currency: order.getCurrency(),
      deliveryFee: order.getDeliveryFee(),
      total: order.getTotal(),
    }
  }

}
