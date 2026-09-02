import { injectable, inject } from "tsyringe"
import { CustomerPreferencesUpdateUseCase } from "./customer-preferences-update.use-case.js";
import { CustomerPreferenceUpdateInput } from "../dto/customer-preference-update.dto.js";
import { IdentityTokens } from "../../../identity/infrastructure/persistence/tokens/identity.tokens.js";
import type { IUserRepository } from "../../../identity/domain/repositories/user.repository.js";
import { AuthenticationError } from "../../../../shared/errors/AuthenticationError.js";
import { CustomerTokens } from "../../infrastructure/persistence/tokens/customer.tokens.js";
import type { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { CustomerNotFoundError } from "../../domain/errors/customer-not-found.error.js";


@injectable()
export class CustomerPreferencesUpdateUseCaseImpl implements CustomerPreferencesUpdateUseCase {
  constructor(

    @inject(IdentityTokens.UserRepository)
    private readonly userRepo: IUserRepository,

    @inject(CustomerTokens.CustomerRepository)
    private readonly customerRepo: ICustomerRepository

  ) { }

  async execute(input: CustomerPreferenceUpdateInput): Promise<void> {

    console.log(input)

    const userId = input.userId

    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new AuthenticationError("User not found")
    }

    const customer = await this.customerRepo.findByUserId(userId)

    if (!customer) {
      throw new CustomerNotFoundError()
    }

    if (input.language !== undefined) {
      console.log("inside languge block")
      customer.updateLanguagePreference(input.language)
    }

    if (input.notifications !== undefined) {

      const currentNotifications = customer.getPreferences().getNotifications()

      const notifications = {
        push: input.notifications.push ?? currentNotifications.push,
        sms: input.notifications.sms ?? currentNotifications.sms,
        email: input.notifications.email ?? currentNotifications.email
      }

      customer.updateNotificationPreference(notifications)
    }

    if (input.marketing !== undefined) {
      customer.updateMarketingPreference({
        enabled: input.marketing.enabled ?? customer.getPreferences().getMarketing().enabled
        })
    }

    await this.customerRepo.update(customer)
  }
}
