import { DriverStatusUpdateInput } from "../dto/driver-status-update.dto.js";

export interface DriverAvailabilityUpdateUseCase {
  execute(input: DriverStatusUpdateInput): Promise<void>
}
