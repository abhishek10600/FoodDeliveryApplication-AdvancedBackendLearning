export const OrderTokens = {

  OrderRepository: Symbol.for("Order.OrderRepository"),
  OrderPricingCatalog: Symbol.for("Order.OrderPricingCatalog"),
  DeliveryFeePolicy: Symbol.for("Order.DeliveryFeePolicy"),
  MenuItemPricingCatalogAdapter: Symbol.for("Order.MenuItemPricingCatalogAdapter"),
  OrderCreationUseCase: Symbol.for("Order.OrderCreationUseCase"),

  PaymentSucceededHandler: Symbol.for("Order.PaymentSucceededHandler"),
  PaymentFailedHandler: Symbol.for("Order.PaymentFailedHandler"),
  OrderingPaymentConsumer: Symbol.for("Order.OrderingPaymentConsumer"),

} as const
