import { Customer } from "../../domain/entities/customer.entity.js";
import { CustomerProfileInput } from "../dto/customer-profile-creation.dto.js";

export interface CustomerProfileCreationUseCase {
  execute(input: CustomerProfileInput): Promise<Customer>
}
