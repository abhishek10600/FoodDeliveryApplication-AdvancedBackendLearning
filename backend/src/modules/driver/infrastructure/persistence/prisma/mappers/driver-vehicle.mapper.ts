import { Prisma } from "../../../../../../../generated/prisma/client.js"
import { DriverVehicle } from "../../../../domain/entities/driver-vehicle.entity.js";
import { DRIVERVEHICLETYPE } from "../../../../domain/enums/driver-vehicle-type.enum.js";
import { DriverVehicleColor } from "../../../../domain/value-objects/driver-vehicle-color.vo.js";
import { DriverVehicleMake } from "../../../../domain/value-objects/driver-vehicle-make.vo.js";
import { DriverVehicleModel } from "../../../../domain/value-objects/driver-vehicle-model.vo.js";
import { DriverVehicleRegistrationNumber } from "../../../../domain/value-objects/driver-vehicle-registration-number.vo.js";

export class DriverVehicleMapper {

  public static toDomain(data: Prisma.DriverVehicleGetPayload<{}>): DriverVehicle {
    return DriverVehicle.rehydrate({
      id: data.id,
      driverId: data.driverId,
      vehicleType: data.vehicleType as DRIVERVEHICLETYPE,
      registrationNumber: DriverVehicleRegistrationNumber.create(data.registrationNumber as string),
      color: DriverVehicleColor.create(data.color),
      model: DriverVehicleModel.create(data.model),
      make: DriverVehicleMake.create(data.make),
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(driverVehicle: DriverVehicle): Prisma.DriverVehicleCreateInput {
    return {
      id: driverVehicle.getId(),
      driver: {
        connect: {
          id: driverVehicle.getDriverId()
        }
      },
      vehicleType: driverVehicle.getVehicleType(),
      registrationNumber: driverVehicle.getRegistrationNumber().getValue(),
      color: driverVehicle.getColor().getValue(),
      model: driverVehicle.getModel().getValue(),
      make: driverVehicle.getMake().getValue(),
      isActive: driverVehicle.getIsActive(),
      createdAt: driverVehicle.getCreatedAt(),
      updatedAt: driverVehicle.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(driverVehicle: DriverVehicle): Prisma.DriverVehicleUpdateInput {
    return {
      id: driverVehicle.getId(),
      driver: {
        connect: {
          id: driverVehicle.getDriverId()
        }
      },
      vehicleType: driverVehicle.getVehicleType(),
      registrationNumber: driverVehicle.getRegistrationNumber().getValue(),
      color: driverVehicle.getColor().getValue(),
      model: driverVehicle.getModel().getValue(),
      make: driverVehicle.getMake().getValue(),
      isActive: driverVehicle.getIsActive(),
      createdAt: driverVehicle.getCreatedAt(),
      updatedAt: driverVehicle.getUpdatedAt()
    }
  }

}
