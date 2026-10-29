import { DriverProfile } from "../../../domain/entities/driver-profile.entity.js";
import { DriverVehicle } from "../../../domain/entities/driver-vehicle.entity.js";
import { DriverProfileResult } from "../driver-profile-result.dto.js";

export class DriverResultMapper {
  public static toResultWithVehicle(driverProfile: DriverProfile, driverVehicle: DriverVehicle): DriverProfileResult {
    return {
      driverId: driverProfile.getId(),
      userId: driverProfile.getUserId(),
      firstName: driverProfile.getFirstName().getValue(),
      lastName: driverProfile.getLastName().getValue(),
      phone: driverProfile.getPhone().getValue(),
      status: driverProfile.getStatus(),
      availability: driverProfile.getAvailability(),
      driverVehicleType: driverVehicle.getVehicleType(),
      driverVehicleRegNo: driverVehicle.getRegistrationNumber().getValue(),
      driverVehicleModel: driverVehicle.getModel().getValue(),
      driverVehicleMake: driverVehicle.getMake().getValue(),
      driverVehicleColor: driverVehicle.getColor().getValue(),
      createdAt: driverProfile.getCreatedAt(),
      updatedAt: driverProfile.getUpdatedAt()
    }
  }
}
