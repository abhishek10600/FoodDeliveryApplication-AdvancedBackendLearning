import { container } from "tsyringe"
import { AddressTokens } from "../../../modules/address/infrastructure/persistence/tokens/address-tokens.js"
import { AddressRepository } from "../../../modules/address/infrastructure/persistence/prisma/address.repository.js"
import { AddressCreationUseCaseImpl } from "../../../modules/address/application/use-cases/address-creation.use-case.impl.js"
import { AddressListByCustomerUseCaseImpl } from "../../../modules/address/application/use-cases/address-list-by-customer.use-case.impl.js"
import { AddressByIdUseCaseImpl } from "../../../modules/address/application/use-cases/address-by-id.use-case.impl.js"

export const registerAddress = (): void => {

  container.register(AddressTokens.AddressRepository, {
    useClass: AddressRepository
  })

  container.registerSingleton(AddressTokens.AddressCreationUseCase, AddressCreationUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressByCustomerUseCase, AddressListByCustomerUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressByIdUseCase, AddressByIdUseCaseImpl)

}
