import { DriverVehicle } from "../entities/driver-vehicle.entity.js";

export interface IDriverVehicleRepository {
  create(driverVehicle: DriverVehicle): Promise<DriverVehicle>
  findById(id: string): Promise<DriverVehicle | null>
  findByDriverId(driverId: string): Promise<DriverVehicle | null>
  update(id: string, driverVehicle: DriverVehicle): Promise<void>
  delete(id: string): Promise<void>
}
