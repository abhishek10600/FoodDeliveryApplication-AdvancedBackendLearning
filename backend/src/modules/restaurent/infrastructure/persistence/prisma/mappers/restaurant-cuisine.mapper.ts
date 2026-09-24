import { Prisma } from "../../../../../../../generated/prisma/client.js"
import { RestaurantCuisine } from "../../../../domain/entities/restaurant-cuisine.entity.js";

export class RestaurantCuisineMapper {
  public static toDomain(data: Prisma.RestaurantCuisinesGetPayload<{}>): RestaurantCuisine {
    return RestaurantCuisine.rehydrate({
      id: data.id,
      restaurantId: data.restaurantId,
      cuisineId: data.cuisineId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(restaurantCuisine: RestaurantCuisine): Prisma.RestaurantCuisinesCreateInput {
    return {
      id: restaurantCuisine.getId(),
      restaurant: {
        connect: {
          id: restaurantCuisine.getRestaurantId(),
        }
      },
      cuisine: {
        connect: {
          id: restaurantCuisine.getCuisineId()
        }
      },
      createdAt: restaurantCuisine.getCreatedAt(),
      updatedAt: restaurantCuisine.getUpdatedAt()
    }
  }

}
