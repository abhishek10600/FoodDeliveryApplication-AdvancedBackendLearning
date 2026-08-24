import { registerInfrastructure } from "./modules/infrastructure.js"

export const registerWorkerDependencies = (): void => {
  registerInfrastructure()
}
