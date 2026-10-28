import { DRIVERVEHICLETYPE } from "../../domain/enums/driver-vehicle-type.enum.js"

export interface RegisterDriverInput {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  vehicleType: DRIVERVEHICLETYPE,
  vehicleRegNo: string,
  vehicleModel: string,
  vehicleColor: string,
  vehicleMake: string
}
