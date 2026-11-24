import { container } from "tsyringe"
import { OrderTokens } from "../../../modules/ordering/infrastructure/persistence/tokens/order.token.js"
import { OrderRepository } from "../../../modules/ordering/infrastructure/persistence/prisma/order.repository.js"
import { FixedDeliveryFeePolicy } from "../../../modules/ordering/application/services/fixed-delivery-fee.policy.js"
import { MenuItemPricingCatalogAdapter } from "../../../modules/ordering/infrastructure/adapters/menu-item-pricing-catalog.adapter.js"

export const registerOrdering = (): void => {

  container.register(OrderTokens.OrderRepository, {
    useClass: OrderRepository
  })

  container.registerSingleton(OrderTokens.DeliveryFeePolicy, FixedDeliveryFeePolicy)

  container.registerSingleton(OrderTokens.MenuItemPricingCatalogAdapter, MenuItemPricingCatalogAdapter)

}
