import { ICuisineRepository } from "../../domain/repositories/cuisine.repository.js";
import { IRestaurantRepository } from "../../domain/repositories/restaurant.repository.js"

export interface IRestaurantTransactionContext {
  restaurantRepository: IRestaurantRepository;
  cuisineRepository: ICuisineRepository;

}

export interface IRestaurantTransaction {
  execute<T>(operation: (context: IRestaurantTransactionContext) => Promise<T>): Promise<T>
}
