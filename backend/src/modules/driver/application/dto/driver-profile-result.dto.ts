import { DRIVERAVAILABILITY } from "../../domain/enums/driver-availability.enum.js";
import { DRIVERSTATUS } from "../../domain/enums/driver-status.enum.js";
import { DRIVERVEHICLETYPE } from "../../domain/enums/driver-vehicle-type.enum.js";

export interface DriverProfileResult {
  driverId: string,
  userId: string,
  firstName: string,
  lastName: string,
  phone: string,
  status: DRIVERSTATUS,
  availability: DRIVERAVAILABILITY,
  driverVehicleType: DRIVERVEHICLETYPE,
  driverVehicleRegNo: string,
  driverVehicleModel: string,
  driverVehicleMake: string,
  driverVehicleColor: string,
  createdAt: Date,
  updatedAt: Date
}
