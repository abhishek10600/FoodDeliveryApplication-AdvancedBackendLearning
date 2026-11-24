export const OrderTokens = {

  OrderRepository: Symbol.for("Order.OrderRepository"),
  OrderPricingCatalog: Symbol.for("Order.OrderPricingCatalog"),
  DeliveryFeePolicy: Symbol.for("Order.DeliveryFeePolicy"),
  MenuItemPricingCatalogAdapter: Symbol.for("Order.MenuItemPricingCatalogAdapter"),

} as const
