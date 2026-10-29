import { DriverProfileResult } from "../dto/driver-profile-result.dto.js";
import { DriverProfileInput } from "../dto/driver-profile.dto.js";

export interface DriverProfileUseCase {
  execute(input: DriverProfileInput): Promise<DriverProfileResult>
}
