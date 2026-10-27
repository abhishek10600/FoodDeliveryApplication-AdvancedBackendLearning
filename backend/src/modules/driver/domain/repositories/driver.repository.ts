import { Driver } from "../entities/driver.entity.js";

export interface IDriverRepository {
  findById(id: string): Promise<Driver | null>
  create(drive: Driver): Promise<Driver>
  update(driver: Driver): Promise<void>
  delete(id: string): Promise<void>
}
