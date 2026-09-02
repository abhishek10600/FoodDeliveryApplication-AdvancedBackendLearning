import { CustomerPreferenceUpdateInput } from "../dto/customer-preference-update.dto.js";

export interface CustomerPreferencesUpdateUseCase {

  execute(input: CustomerPreferenceUpdateInput): Promise<void>

}
