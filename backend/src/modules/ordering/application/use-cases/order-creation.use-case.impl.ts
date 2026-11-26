import { injectable, inject } from "tsyringe"
import { OrderCreationInput, OrderCreationMetadata, OrderCreationResult, OrderCreationUseCase } from "./order-creation.use-case.js";
import { OrderTokens } from "../../infrastructure/persistence/tokens/order.token.js";
import type { IOrderRepository } from "../../domain/repositories/order.repository.js";
import { RestaurantTokens } from "../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../restaurent/domain/repositories/restaurant.repository.js";
import { AddressTokens } from "../../../address/infrastructure/persistence/tokens/address-tokens.js";
import type { IAddressRepository } from "../../../address/domain/repositories/address.repository.js";
import { OrderPricingService } from "../services/order-pricing.service.js";
import { OutboxService } from "../../../../infrastructure/messaging/outbox/outbox.service.js";
import { EventFactory } from "../../../../infrastructure/messaging/events/event.factory.js";
import { Order } from "../../domain/entities/order.entity.js";
import { OrderDomainError } from "../../domain/errors/order.domain.error.js";
import { RestaurantStatus } from "../../../../../generated/prisma/index.js";
import { withTransaction } from "../../../../infrastructure/database/transaction.js";
import { Prisma } from "../../../../../generated/prisma/client.js"
import { OrderPlacedV1 } from "../../../../infrastructure/messaging/events/ordering/order-place.v1.js";
import { OrderEventTopics } from "../../../../infrastructure/messaging/topics/order.event-topics.js";
import { CustomerTokens } from "../../../customer/infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../../customer/domain/repositories/customer.repository.js";

@injectable()
export class OrderCreationUseCaseImpl implements OrderCreationUseCase {
  constructor(

    @inject(OrderTokens.OrderRepository)
    private readonly orderRepo: IOrderRepository,

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(AddressTokens.AddressRepository)
    private readonly addressRepo: IAddressRepository,

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository,

    private readonly pricingService: OrderPricingService,

    private readonly outboxService: OutboxService,

    private readonly eventFactory: EventFactory

  ) { }

  async execute(userId: string, input: OrderCreationInput, metadata: OrderCreationMetadata): Promise<OrderCreationResult> {

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new OrderDomainError("Customer not found", 404)
    }

    const customerId = customer.getId()

    const existingOrder = await this.orderRepo.findByCustomerIdAndIdempotencyKey(customerId, metadata.idempotencyKey)

    if (existingOrder) {
      return this.toResult(existingOrder)
    }

    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new OrderDomainError("Restaurant not found", 404)
    }

    if (restaurant.getStatus() !== RestaurantStatus.ACTIVE) {
      throw new OrderDomainError("Restaurant is not active", 400)
    }

    const address = await this.addressRepo.findById(input.addressId)

    if (!address) {
      throw new OrderDomainError("Delivery order not found", 404)
    }

    console.log(`Address_CUstomerId: ${address.getCustomerId()}`)
    console.log(`customer_id: ${customerId}`)

    if (address.getCustomerId() !== customerId) {
      throw new OrderDomainError("Delivery address does not belong to this customer", 400)
    }

    const pricing = await this.pricingService.calculate({
      restaurantId: input.restaurantId,
      items: input.items
    })

    const order = Order.create({
      customerId,
      restaurantId: input.restaurantId,
      addressId: input.addressId,
      items: pricing.items,
      idempotencyKey: metadata.idempotencyKey,
      deliveryFee: pricing.deliveryFee,
      currency: pricing.currency
    });

    const event = this.eventFactory.create(OrderPlacedV1,
      {
        orderId: order.getId(),
        customerId: order.getCustomerId(),
        restaurantId: order.getRestaurantId(),
        addressId: order.getAddressId(),
        items: order.getItems().map((item) => ({
          menuItemId: item.getMenuItemId(),
          itemName: item.getItemName(),
          unitPrice: item.getUnitPrice(),
          quantity: item.getQuantity(),
          lineTotal: item.getLineTotal()
        })),
        subTotal: order.getSubTotal(),
        deliveryFee: order.getDeliveryFee(),
        total: order.getTotal(),
        currency: order.getCurrency(),
        status: order.getStatus(),
        createdAt: order.getCreatedAt().toISOString()
      },
      {
        correlationId: metadata.correlationId,
        causationId: null
      },
      "foodflow-ordering"
    )

    await withTransaction(async (tx) => {
      await this.orderRepo.create(order)

      await this.outboxService.save(
        {
          eventId: event.id,
          eventType: event.eventType,
          eventVersion: event.eventVersion,
          aggregateId: order.getId(),
          aggregateType: "Order",
          topic: OrderEventTopics.Orders,
          messageKey: order.getId(),
          payload: event as unknown as Prisma.InputJsonValue,
          correlationId: event.correlationId,
          causationId: event.causationId ?? undefined,
          occurredAt: new Date(event.occurredAt)
        }, tx)
    })

    return this.toResult(order)
  }

  private toResult(order: Order): OrderCreationResult {
      return {
        orderId: order.getId(),
        status: order.getStatus(),
        subTotal: order.getSubTotal(),
        deliveryFee: order.getDeliveryFee(),
        total: order.getTotal(),
        currency: order.getCurrency()
      };
    }
}
