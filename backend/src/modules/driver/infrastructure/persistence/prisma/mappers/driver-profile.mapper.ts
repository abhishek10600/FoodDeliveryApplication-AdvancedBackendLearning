import { Prisma } from "../../../../../../../generated/prisma/client.js"
import { DriverProfile } from "../../../../domain/entities/driver-profile.entity.js"
import { DRIVERAVAILABILITY } from "../../../../domain/enums/driver-availability.enum.js"
import { DRIVERSTATUS } from "../../../../domain/enums/driver-status.enum.js"
import { DriverFirstName } from "../../../../domain/value-objects/driver-first-name.vo.js"
import { DriverLastName } from "../../../../domain/value-objects/driver-last-name.vo.js"
import { DriverPhone } from "../../../../domain/value-objects/driver-phone.vo.js"

export class DriverProfileMapper {
  public static toDomain(data: Prisma.DriverGetPayload<{}>): DriverProfile {
    return DriverProfile.rehydrate({
      id: data.id,
      userId: data.userId,
      firstName: DriverFirstName.create(data.firstName),
      lastName: DriverLastName.create(data.lastName),
      phone: DriverPhone.create(data.phone),
      status: data.status as DRIVERSTATUS,
      availability: data.availability as DRIVERAVAILABILITY,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(driver: DriverProfile): Prisma.DriverCreateInput {
    return {
      id: driver.getId(),
      user: {
        connect: {
          id: driver.getUserId()
        }
      },
      firstName: driver.getFirstName().getValue(),
      lastName: driver.getLastName().getValue(),
      phone: driver.getPhone().getValue(),
      status: driver.getStatus(),
      availability: driver.getAvailability(),
      createdAt: driver.getCreatedAt(),
      updatedAt: driver.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(driver: DriverProfile): Prisma.DriverUpdateInput {
    return {
      id: driver.getId(),
      user: {
        connect: {
          id: driver.getUserId()
        }
      },
      firstName: driver.getFirstName().getValue(),
      lastName: driver.getLastName().getValue(),
      phone: driver.getPhone().getValue(),
      status: driver.getStatus(),
      availability: driver.getAvailability(),
      createdAt: driver.getCreatedAt(),
      updatedAt: driver.getUpdatedAt()
    }
  }
}
