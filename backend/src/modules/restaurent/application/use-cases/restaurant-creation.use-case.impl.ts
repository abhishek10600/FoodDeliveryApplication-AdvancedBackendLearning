import { injectable, inject } from "tsyringe"
import { RestaurantCreationResult } from "../dto/restaurant-creation-result.dto.js";
import { RestaurantCreationInput } from "../dto/restaurant-creation.dto.js";
import { RestaurantCreationUseCase } from "./restaurant-creation.use-case.js";
import { RestaurantTokens } from "../../infrastructure/persistence/tokens/restaurant.tokens.js";
import type { ICuisineRepository } from "../../domain/repositories/cuisine.repository.js";
import { InvalidRestaurantCuisineError } from "../../domain/errors/invalud-restaurant-cusine.error.js";
import { RestaurantOpeningHours } from "../../domain/value-objects/restaurnat-opening-hours.vo.js";
import { Restaurant } from "../../domain/entities/restaurant.entity.js";
import { RestaurantName } from "../../domain/value-objects/restaurant-name.vo.js";
import { RestaurantDescription } from "../../domain/value-objects/restaurant-description.vo.js";
import { RestaurantPhone } from "../../domain/value-objects/restaurant-phone.vo.js";
import { RestaurantEmail } from "../../domain/value-objects/restaurant-email.vo.js";
import type { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js";
import { RestaurantAddress } from "../../domain/value-objects/restaurant-address.vo.js";

@injectable()
export class RestaurantCreationUseCaseImpl implements RestaurantCreationUseCase {

  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(RestaurantTokens.CuisineRepository)
    private readonly cuisineRepo: ICuisineRepository

  ) { }

  async execute(ownerId: string, input: RestaurantCreationInput): Promise<RestaurantCreationResult> {
    const cuisineIds = input.cuisineIds

    const uniqueCuisineIds = [...new Set(cuisineIds)]

    if (uniqueCuisineIds.length > 0) {
      const cuisines = await this.cuisineRepo.findByIds(uniqueCuisineIds)

      const existingCuisineIds = new Set(cuisines.map((cuisine) => cuisine.getId()))

      const invalidCuisineIds = uniqueCuisineIds.filter((id) => !existingCuisineIds.has(id))

      if (invalidCuisineIds.length > 0) {
        throw new InvalidRestaurantCuisineError("Invalid cuisine ids")
      }
    }

    const openingHours = input.openingHours.map((openingHour) => RestaurantOpeningHours.create({
      dayOfWeek: openingHour.dayOfWeek,
      opensAt: openingHour.opensAt ?? undefined,
      closesAt: openingHour.closesAt ?? undefined,
      isClosed: openingHour.isClosed
    }))

    const restaurant = Restaurant.create({
      ownerId,
      name: RestaurantName.create(input.name),
      description: RestaurantDescription.create(input.description),
      phone: RestaurantPhone.create(input.phone),
      email: RestaurantEmail.create(input.email),
      address: RestaurantAddress.create(input.address),
    })

    for (const cuisineId of uniqueCuisineIds) {
      restaurant.addCuisine(cuisineId)
    }

    for (const openingHour of openingHours) {
      restaurant.updateOpeningHours(
        RestaurantOpeningHours.create({
          dayOfWeek: openingHour.getDayOfWeek(),
          opensAt: openingHour.getOpensAt(),
          closesAt: openingHour.getClosesAt(),
          isClosed: openingHour.getIsClosed()
        })
      )
    }

    const newRestaurant = await this.restaurantRepo.create(restaurant)

    return {
      id: newRestaurant.getId(),
      ownerId: newRestaurant.getOwnerId(),
      name: newRestaurant.getName().getValue(),
      description: newRestaurant.getDescription().getValue(),
      phone: newRestaurant.getPhone().getValue(),
      email: newRestaurant.getEmail().getValue(),
      address: {
        line1: newRestaurant.getAddress().getLine1(),
        landMark: newRestaurant.getAddress().getlandMark(),
        city: newRestaurant.getAddress().getCity(),
        state: newRestaurant.getAddress().getState(),
        country: newRestaurant.getAddress().getCountry(),
        postalCode: newRestaurant.getAddress().getPostalCode(),
      },
      status: newRestaurant.getStatus(),
      openingHours: newRestaurant.getOpeningHours().map((hour) => ({
        dayOfWeek: hour.getDayOfWeek(),
        opensAt: hour.getOpensAt() ?? null,
        closesAt: hour.getClosesAt() ?? null,
        isClosed: hour.getIsClosed()
      })),
      cuisineIds: newRestaurant.getCuisines().map((cuisine) => cuisine.getId()),
      createdAt: newRestaurant.getCreatedAt(),
      updatedAt: newRestaurant.getUpdatedAt()
    }

  }

}
