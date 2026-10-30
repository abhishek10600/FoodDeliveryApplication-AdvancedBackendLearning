import { DriverProfileUpdateInput } from "../dto/driver-profile-update.dto.js";

export interface DriverProfileUpdateUseCase {
  execute(input: DriverProfileUpdateInput): Promise<void>
}
