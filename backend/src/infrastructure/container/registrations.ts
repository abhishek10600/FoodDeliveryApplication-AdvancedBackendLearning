import { registerInfrastructure } from "./modules/infrastructure.js"

export const registerDependencies = (): void => {
  registerInfrastructure();

  // Future modules
  //
  // registerIdentity()
  // registerCustomer()
  // registerRestaurant()....
}
