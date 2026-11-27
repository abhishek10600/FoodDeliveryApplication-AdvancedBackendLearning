import { container } from "tsyringe"
import { OrderTokens } from "../../../modules/ordering/infrastructure/persistence/tokens/order.token.js"
import { OrderRepository } from "../../../modules/ordering/infrastructure/persistence/prisma/order.repository.js"
import { FixedDeliveryFeePolicy } from "../../../modules/ordering/application/services/fixed-delivery-fee.policy.js"
import { MenuItemPricingCatalogAdapter } from "../../../modules/ordering/infrastructure/adapters/menu-item-pricing-catalog.adapter.js"
import { OrderCreationUseCaseImpl } from "../../../modules/ordering/application/use-cases/order-creation.use-case.impl.js"
import { PaymentSucceededHandler } from "../../messaging/consumers/payment-succeeded.handler.js"
import { PaymentFailedHandler } from "../../messaging/consumers/payment-failed.handler.js"
import { OrderingPaymentConsumer } from "../../messaging/consumers/ordering-payment.consumer.js"

export const registerOrdering = (): void => {

  container.register(OrderTokens.OrderRepository, {
    useClass: OrderRepository
  })

  container.registerSingleton(OrderTokens.OrderPricingCatalog, MenuItemPricingCatalogAdapter)

  container.registerSingleton(OrderTokens.DeliveryFeePolicy, FixedDeliveryFeePolicy)

  // container.registerSingleton(OrderTokens.MenuItemPricingCatalogAdapter, MenuItemPricingCatalogAdapter)

  container.registerSingleton(OrderTokens.OrderCreationUseCase, OrderCreationUseCaseImpl)

  container.registerSingleton(OrderTokens.PaymentSucceededHandler, PaymentSucceededHandler)

  container.registerSingleton(OrderTokens.PaymentFailedHandler, PaymentFailedHandler)

  container.registerSingleton(OrderTokens.OrderingPaymentConsumer, OrderingPaymentConsumer)

}
