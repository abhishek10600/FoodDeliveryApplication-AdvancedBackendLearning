import { container } from "tsyringe"
import { CustomerTokens } from "../../../modules/customer/infrastructure/persistence/tokens/customer.tokens.js"
import { CustomerRepository } from "../../../modules/customer/infrastructure/persistence/prisma/customer.respository.js"
import { CustomerProfileCreationUseCaseImpl } from "../../../modules/customer/application/use-cases/customer-profile-creation.use-case.impl.js"
import { GetCustomerProfileUseCaseImpl } from "../../../modules/customer/application/use-cases/get-customer-profile.use-case.impl.js"
import { CustomerProfileUpdateUseCaseImpl } from "../../../modules/customer/application/use-cases/customer-profile-update.use-case.impl.js"
import { CustomerPreferencesUpdateUseCaseImpl } from "../../../modules/customer/application/use-cases/customer-preferences-update.use-case.impl.js"

export const registerCustomer = (): void => {
  container.register(CustomerTokens.CustomerRepository, {
    useClass: CustomerRepository
  })

  container.registerSingleton(CustomerTokens.CustomerProfileCreationUseCase, CustomerProfileCreationUseCaseImpl)

  container.registerSingleton(CustomerTokens.GetCustomerProfileUseCase, GetCustomerProfileUseCaseImpl)

  container.registerSingleton(CustomerTokens.CustomerProfileUpdateUseCase, CustomerProfileUpdateUseCaseImpl)

  container.registerSingleton(CustomerTokens.CustomerPreferencesUpdateUseCase, CustomerPreferencesUpdateUseCaseImpl)
}
