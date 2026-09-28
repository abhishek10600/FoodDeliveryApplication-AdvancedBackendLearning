import { injectable, inject } from "tsyringe"
import { IRestaurantRepository } from "../../../domain/repositories/restaurant.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Restaurant } from "../../../domain/entities/restaurant.entity.js";
import { RestaurantMapper } from "./mappers/restaurant.mapper.js";
import { RestaurantCuisine } from "../../../domain/entities/restaurant-cuisine.entity.js";
import { RestaurantCuisineMapper } from "./mappers/restaurant-cuisine.mapper.js";
import { RestaurantListFilterInput } from "../../../application/dto/resruarant-list.dto.js";
import { Prisma } from "../../../../../../generated/prisma/client.js";
import { decodeRestaurantCursor, encodeRestaurantCursor } from "../../../../../shared/pagination/restaurant-cursor.js";
import { RestaurantListResult } from "../../../application/dto/restaurant-list-response.dto.js";

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

  async get(filters: RestaurantListFilterInput): Promise<RestaurantListResult> {

    const { cuisine, city, sortBy, limit: requestedLimit, cursor } = filters

    const limit = requestedLimit ?? 10;

    const where: Prisma.RestaurantWhereInput = {
      status: "ACTIVE"
    }

    // filter by cuisine
    if (cuisine) {
      where.cuisines = {
        some: {
          cuisine: {
            slug: {
              equals: cuisine.toLowerCase(),
              mode: "insensitive"
            }
          }
        }
      }
    }

    if (city) {
      where.city = {
        equals: city,
        mode: "insensitive"
      }
    }

    // cursor pagination

    if (cursor) {
      const decodedCursor = decodeRestaurantCursor(cursor)

      where.AND = [
        {
          OR: [
            {
              name: {
                gt: decodedCursor.name
              }
            },

            {
              AND: [
                {
                  name: {
                    equals: decodedCursor.name
                  }
                }
              ]
            }
          ]
        }
      ]
    }

    // sorting
    //
    const orderBy: Prisma.RestaurantOrderByWithRelationInput[] = [];

    if (sortBy === "name") {
      orderBy.push(
      {
        name: "asc"
      },
      {
        id: "asc"
      }
      )
    }

    const restaurants = await this.prisma.restaurant.findMany({
      where,
      orderBy,
      take: limit + 1,
      include: {
        cuisines: true,
        openingHours: true
      }
    })

    const hasNextPage = restaurants.length > limit;

    const items = hasNextPage ? restaurants.slice(0, limit) : restaurants

    let nextCursor: string | null = null

    if (hasNextPage) {
      const lastRestaurant = items[items.length - 1]

      nextCursor = encodeRestaurantCursor({
        name: lastRestaurant.name,
        id: lastRestaurant.id
      })
    }

    const domainRestaurants = items.map(restaurant => RestaurantMapper.toDomain(restaurant))


    return {
      items: domainRestaurants,
      nextCursor,
      hasNextPage
    }
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
