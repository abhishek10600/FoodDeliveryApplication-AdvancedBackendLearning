import { Cuisine } from "../entities/cuisine.entity.js";

export interface ICuisineRepository {
  findByIds(ids: string[]): Promise<Cuisine[]>
  findById(id: string): Promise<Cuisine | null>

}
