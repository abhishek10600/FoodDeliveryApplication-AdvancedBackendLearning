import { GetCustomerProfileResult } from "../dto/get-customer-profile-result.dto.js";
import { GetCustomerProfileInput } from "../dto/get-customer-profile.dto.js";

export interface GetCustomerProfileUseCase {
  execute(input: GetCustomerProfileInput): Promise<GetCustomerProfileResult>
}
