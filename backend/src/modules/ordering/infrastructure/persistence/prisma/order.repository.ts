import { injectable, inject } from "tsyringe"
import { IOrderListOptions, IOrderRepository, IOrderResultOptions } from "../../../domain/repositories/order.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Order } from "../../../domain/entities/order.entity.js";
import { orderInclude, OrderMapper } from "../mappers/order.mapper.js";
import { OrderStatus } from "../../../domain/enums/order-status.enum.js";
import { Prisma } from "../../../../../../generated/prisma/index.js";

@injectable()
export class OrderRepository implements IOrderRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async create(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order)

    const newOrder = await this.prisma.order.create({
      data,
      include: {
        items: true
      }
    })

    return OrderMapper.toDomain(newOrder)
  }

  async findByOrderId(orderId: string): Promise<Order | null> {

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return null
    }

    return OrderMapper.toDomain(order)

  }

  async findByOrderIdAndCustomerId(orderId: string, customerId: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        customerId
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return null
    }

    return OrderMapper.toDomain(order)
  }

  async findManyByCustomerId(customerId: string, options: IOrderListOptions): Promise<IOrderResultOptions> {
    const orders = await this.prisma.order.findMany({

      where: {
        customerId,
        ...(options.status && {
          status: options.status as unknown as OrderStatus
        })
      },

      ...(options.cursor && {
        cursor: {
          id: options.cursor
        },
        skip: 1
      }),

      take: options.limit + 1,

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        }
      ],

      include: orderInclude
    })

    const hasMore = orders.length > options.limit

    const paginatedOrders = hasMore ? orders.slice(0, options.limit) : orders

    const nextCursor = hasMore ? paginatedOrders[paginatedOrders.length - 1]?.id ?? null : null

    return {
      orders: paginatedOrders.map((order) => OrderMapper.toDomain(order)),
      nextCursor,
      hasMore
    }
  }

  async findByCustomerIdAndIdempotencyKey(customerId: string, idempotencyKey: string): Promise<Order | null> {

    const order = await this.prisma.order.findUnique({
      where: {
        customerId_idempotencyKey: {
          customerId,
          idempotencyKey
        }
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return null
    }

    return OrderMapper.toDomain(order)

  }

  async update(order: Order): Promise<void> {
    const data = OrderMapper.toUpdatePersistence(order)

    await this.prisma.order.update({
      where: {
        id: order.getId()
      },
      data
    })
  }

  async findByOrderIdInTransaction(orderId: string, tx: Prisma.TransactionClient): Promise<Order | null> {

    const data = await tx.order.findUnique({
      where: {
        id: orderId
      },

      include: {
        items: true
      }
    })

    if (!data) {
      return null
    }

    return OrderMapper.toDomain(data)
  }

  async updateInTransaction(order: Order, tx: Prisma.TransactionClient): Promise<void> {

    await tx.order.update({
      where: {
        id: order.getId()
      },

      data: {
        status: order.getStatus(),
        updatedAt: order.getUpdatedAt()
      }
    })

  }

}
