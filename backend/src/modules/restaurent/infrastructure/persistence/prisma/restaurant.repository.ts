import { injectable, inject } from "tsyringe"
import { IRestaurantRepository } from "../../../domain/repositories/restaurant.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Restaurant } from "../../../domain/entities/restaurant.entity.js";
import { RestaurantMapper } from "./mappers/restaurant.mapper.js";
import { RestaurantCuisine } from "../../../domain/entities/restaurant-cuisine.entity.js";
import { RestaurantCuisineMapper } from "./mappers/restaurant-cuisine.mapper.js";

@injectable()
export class RestaurantRepository implements IRestaurantRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async create(restaurant: Restaurant): Promise<Restaurant> {
    const data = RestaurantMapper.toPersistence(restaurant)

    const newRestaurant = await this.prisma.restaurant.create({
      data,
      include: {
        cuisines: true,
        openingHours: true
      }
    })

    return RestaurantMapper.toDomain(newRestaurant)

  }

  async findById(id: string): Promise<Restaurant | null> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: {
        id
      },
      include: {
        cuisines: true,
        openingHours: true
      }
    })

    if (!restaurant) {
      return null
    }

    return RestaurantMapper.toDomain(restaurant)
  }

  async findByOwnerId(ownerId: string): Promise<Restaurant[]> {

    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        ownerId
      },
      include: {
        cuisines: true,
        openingHours: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return restaurants.map((restaurant) => RestaurantMapper.toDomain(restaurant))
  }

  async update(restaurant: Restaurant): Promise<void> {
    const data = RestaurantMapper.toUpdatePersistence(restaurant)

    await this.prisma.restaurant.update({
      where: {
        id: restaurant.getId()
      },
      data
    })
  }

  async createRestaurantCuisine(restaurantCuisine: RestaurantCuisine): Promise<RestaurantCuisine> {
    const data = RestaurantCuisineMapper.toPersistence(restaurantCuisine)

    const newRestaurantCuisine = await this.prisma.restaurantCuisines.create({
      data
    })

    return RestaurantCuisineMapper.toDomain(newRestaurantCuisine)
  }
}
