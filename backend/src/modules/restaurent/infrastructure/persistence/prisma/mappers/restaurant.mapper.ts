import { Prisma } from "../../../../../../../generated/prisma/index.js"
import { Restaurant, RestaurantCuisine } from "../../../../domain/entities/index.js";
import { RestaurantStatus } from "../../../../domain/enums/restaurant-status.enum.js";
import { DayOfWeek } from "../../../../domain/enums/restaurnat-opening-hours.enum.js";
import { RestaurantAddress, type RestaurantAddressProps } from "../../../../domain/value-objects/restaurant-address.vo.js";
import { RestaurantDescription } from "../../../../domain/value-objects/restaurant-description.vo.js";
import { RestaurantEmail } from "../../../../domain/value-objects/restaurant-email.vo.js";
import { RestaurantName } from "../../../../domain/value-objects/restaurant-name.vo.js";
import { RestaurantPhone } from "../../../../domain/value-objects/restaurant-phone.vo.js";
import { RestaurantOpeningHours } from "../../../../domain/value-objects/restaurnat-opening-hours.vo.js";

export class RestaurantMapper {

  public static toDomain(
    data: Prisma.RestaurantGetPayload<{
      include: {
        cuisines: true;
        openingHours: true
      }
    }>
  ): Restaurant {

    const cuisines = data.cuisines.map((cuisine) => RestaurantCuisine.rehydrate({
      id: cuisine.id,
      restaurantId: cuisine.restaurantId,
      cuisineId: cuisine.cuisineId,
      createdAt: cuisine.createdAt,
      updatedAt: cuisine.updatedAt
    }))

    const openingHours = data.openingHours.map((openingHours) => RestaurantOpeningHours.create({
      dayOfWeek: openingHours.dayOfWeek as DayOfWeek,
      opensAt: openingHours.opensAt ?? undefined,
      closesAt: openingHours.closesAt ?? undefined,
      isClosed: openingHours.isClosed
    }))

    return Restaurant.rehydrate({
      id: data.id,
      ownerId: data.ownerId,
      name: RestaurantName.create(data.name),
      description: RestaurantDescription.create(data.description),
      phone: RestaurantPhone.create(data.phone),
      email: RestaurantEmail.create(data.email),
      address: RestaurantAddress.create(RestaurantMapper.toAddressProps(data.address)),
      status: data.status as RestaurantStatus,
      cuisines,
      openingHours,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })

  }

  private static toAddressProps(value: Prisma.JsonValue): RestaurantAddressProps {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("Invalid restaurant address")
    }

    const address = value as Record<string, unknown>

    if (typeof address.line1 !== "string" ||
          typeof address.landmark !== "string" ||
          typeof address.city !== "string" ||
          typeof address.state !== "string" ||
          typeof address.country !== "string" ||
      typeof address.postalCode !== "string") {
      throw new Error("Invalid restaurant address")
    }

    return {
      line1: address.line1,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
    }
  }

  public static toPersistence(restaurant: Restaurant): Prisma.RestaurantCreateInput {
    return {
      id: restaurant.getId(),
      owner: {
        connect: {
          id: restaurant.getOwnerId()
        }
      },
      name: restaurant.getName().getValue(),
      description: restaurant.getDescription().getValue(),
      phone: restaurant.getPhone().getValue(),
      email: restaurant.getEmail().getValue(),
      address: {
        line: restaurant.getAddress().getLine1(),
        landMark: restaurant.getAddress().getLandMark(),
        city: restaurant.getAddress().getCity(),
        state: restaurant.getAddress().getState(),
        country: restaurant.getAddress().getCountry(),
        postalCode: restaurant.getAddress().getPostalCode()
      },
      status: restaurant.getStatus(),
      cuisines: {
        create: restaurant.getCuisines().map((cuisine) => ({
          id: cuisine.getId(),
          cuisine: {
            connect: {
              id: cuisine.getCuisineId(),
            }
          },
          createdAt: cuisine.getCreatedAt(),
          updatedAt: cuisine.getUpdatedAt()
        }))
      },
      openingHours: {
        create: restaurant.getOpeningHours().map((openingHours) => ({
          id: crypto.randomUUID(),
          dayOfWeek: openingHours.getDayOfWeek(),
          opensAt: openingHours.getOpensAt() ?? null,
          closesAt: openingHours.getClosesAt() ?? null,
          isClosed: openingHours.getIsClosed(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      },
      createdAt: restaurant.getCreatedAt(),
      updatedAt: restaurant.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(restaurant: Restaurant): Prisma.RestaurantUpdateInput {
    return {
      name: restaurant.getName().getValue(),
      description: restaurant.getDescription().getValue(),
      email: restaurant.getEmail().getValue(),
      phone: restaurant.getPhone().getValue(),
      status: restaurant.getStatus(),
      cuisines: {
        deleteMany: {},
        create: restaurant.getCuisines().map((cuisine) => ({
          id: cuisine.getId(),
          cuisine: {
            connect: {
              id: cuisine.getCuisineId(),
            }
          },
          createdAt: cuisine.getCreatedAt(),
          updatedAt: cuisine.getUpdatedAt()
        }))
      },
      openingHours: {
        deleteMany: {},
        create: restaurant.getOpeningHours().map((openingHours) => ({
          id: crypto.randomUUID(),
          dayOfWeek: openingHours.getDayOfWeek(),
          opensAt: openingHours.getOpensAt() ?? null,
          closesAt: openingHours.getClosesAt() ?? null,
          isClosed: openingHours.getIsClosed(),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      },
      updatedAt: restaurant.getUpdatedAt()
    }
  }

}
