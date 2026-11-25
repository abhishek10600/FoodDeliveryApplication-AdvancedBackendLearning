import { EventRegistry } from "./event-registry.js";
import { UserRegisteredV1 } from "./identity/user-registered.v1.js";
import { OrderPlacedV1 } from "./ordering/order-place.v1.js";
import { PaymentFailedV1 } from "./payment/payment-failed.v1.js";
import { PaymentSucceededV1 } from "./payment/payment-succeeded.v1.js";

export function registerEvents(): EventRegistry {
  const registry = new EventRegistry()

  registry.register(UserRegisteredV1)
  registry.register(PaymentSucceededV1)
  registry.register(PaymentFailedV1)
  registry.register(OrderPlacedV1)

  return registry
}
