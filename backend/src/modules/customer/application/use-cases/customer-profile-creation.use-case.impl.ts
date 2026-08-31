import { injectable } from "tsyringe"
import { CustomerProfileCreationUseCase } from "./customer-profile-creation.use-case.js";
import { CustomerProfileInput } from "../dto/customer-profile-creation.dto.js";
import { Customer } from "../../domain/entities/customer.entity.js";
import { CustomerFirstName } from "../../domain/value-objects/customer-first-name.vo.js";
import { CustomerLastName } from "../../domain/value-objects/customer-last-name.vo.js";
import { CustomerPhoneNumber } from "../../domain/value-objects/customer-phone.vo.js";
import { CustomerAvatarUrl } from "../../domain/value-objects/customer-avatar.vo.js";
import { CustomerPreferences } from "../../domain/value-objects/customer-preferences.vo.js";

@injectable()
export class CustomerProfileCreationUseCaseImpl implements CustomerProfileCreationUseCase {

  constructor() { }

  async execute(input: CustomerProfileInput): Promise<Customer> {

    console.log({customerProfileCreationInput: input})

    const now = new Date()

    const customerEntity = Customer.create({
      userId: input.userId,
      firstName: CustomerFirstName.create(input.firstName),
      lastName: CustomerLastName.create(input.lastName),
      phone: CustomerPhoneNumber.create(input.phone),
      avatarUrl: CustomerAvatarUrl.create(input.avatarUrl ?? null),
      preferences: CustomerPreferences.default(),
      createdAt: now,
      updatedAt: now
    })

    console.log({customerEntity})

    return customerEntity

  }

}
