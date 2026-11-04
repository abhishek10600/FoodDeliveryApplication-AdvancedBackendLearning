import { container } from "tsyringe"
import { AddressTokens } from "../../../modules/address/infrastructure/persistence/tokens/address-tokens.js"
import { AddressRepository } from "../../../modules/address/infrastructure/persistence/prisma/address.repository.js"
import { AddressCreationUseCaseImpl } from "../../../modules/address/application/use-cases/address-creation.use-case.impl.js"
import { AddressListByCustomerUseCaseImpl } from "../../../modules/address/application/use-cases/address-list-by-customer.use-case.impl.js"
import { AddressByIdUseCaseImpl } from "../../../modules/address/application/use-cases/address-by-id.use-case.impl.js"
import { AddressSetDefaultUseCaseImpl } from "../../../modules/address/application/use-cases/address-set-default.use-case.impl.js"
import { AddressUpdateUseCaseImpl } from "../../../modules/address/application/use-cases/address-update.use-case.impl.js"
import { AddressDeleteUseCaseImpl } from "../../../modules/address/application/use-cases/address-delete-use-case.impl.js"

export const registerAddress = (): void => {

  container.register(AddressTokens.AddressRepository, {
    useClass: AddressRepository
  })

  container.registerSingleton(AddressTokens.AddressCreationUseCase, AddressCreationUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressByCustomerUseCase, AddressListByCustomerUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressByIdUseCase, AddressByIdUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressSetDefaultUseCase, AddressSetDefaultUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressUpdateUseCase, AddressUpdateUseCaseImpl)

  container.registerSingleton(AddressTokens.AddressDeleteUseCase, AddressDeleteUseCaseImpl)
}
