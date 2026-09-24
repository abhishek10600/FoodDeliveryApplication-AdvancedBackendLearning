import { injectable, inject } from "tsyringe"
import { IRestaurantTransaction, IRestaurantTransactionContext } from "../../../application/transaction/restaurant.transaction.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import { PrismaClient } from "../../../../../../generated/prisma/client.js";
import { RestaurantRepository } from "./restaurant.repository.js";
import { CuisineRepositopry } from "./cuisine.repository.js";

@injectable()
export class RestaurantTransaction implements IRestaurantTransaction {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaClient

  ) { }

  async execute<T>(operation: (context: IRestaurantTransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const restaurantRepository = new RestaurantRepository(tx)
      const cuisineRepository = new CuisineRepositopry(tx)

      return operation({
        restaurantRepository,
        cuisineRepository
      })
    })
  }
}
