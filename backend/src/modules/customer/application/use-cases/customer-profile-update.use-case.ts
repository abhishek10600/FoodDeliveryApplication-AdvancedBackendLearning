import { CustomerProfileUpdateResult } from "../dto/customer-profile-update-result.dto.js";
import { CustomerProfileUpdateInput } from "../dto/customer-profile-update.dto.js";

export interface CustomerProfileUpdateUseCase {

  execute(input: CustomerProfileUpdateInput): Promise<CustomerProfileUpdateResult>

}
