import { RegisterDriverResult } from "../dto/register-driver-result.dto.js";
import { RegisterDriverInput } from "../dto/register-driver.dto.js";

export interface DriverRegisterUseCase {
  execute(input: RegisterDriverInput): Promise<RegisterDriverResult>
}
