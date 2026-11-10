import { EventRegistry } from "./event-registry.js";
import { UserRegisteredV1 } from "./identity/user-registered.v1.js";

export function registerEvents(): EventRegistry {
  const registry = new EventRegistry()

  registry.register(UserRegisteredV1)

  return registry
}
