import { DriverProfile } from "../entities/driver-profile.entity.js";

export interface IDriverRepository {
  findById(id: string): Promise<DriverProfile | null>
  create(driver: DriverProfile): Promise<DriverProfile>
  update(id: string, driver: DriverProfile): Promise<void>
  delete(id: string): Promise<void>
}
