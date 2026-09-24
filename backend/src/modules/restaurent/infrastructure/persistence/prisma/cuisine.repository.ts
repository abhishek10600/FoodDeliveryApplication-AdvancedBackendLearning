import { injectable, inject } from "tsyringe"
import { ICuisineRepository } from "../../../domain/repositories/cuisine.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Cuisine } from "../../../domain/entities/cuisine.entity.js";
import { CuisineMapper } from "./mappers/cuisine.mapper.js";

@injectable()
export class CuisineRepositopry implements ICuisineRepository {

  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findByIds(ids: string[]): Promise<Cuisine[]> {
    const cuisines = await this.prisma.cuisine.findMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return cuisines.map((cuisine) => CuisineMapper.toDomain(cuisine))
  }

  async findById(id: string): Promise<Cuisine | null> {
    const cuisine = await this.prisma.cuisine.findUnique({
      where: {
        id
      }
    })

    if (!cuisine) {
      return null
    }

    return CuisineMapper.toDomain(cuisine)
  }

  async create(cuisine: Cuisine): Promise<Cuisine> {
    const data = CuisineMapper.toPersistence(cuisine)

    const newCuisine = await this.prisma.cuisine.create({
      data
    })

    return CuisineMapper.toDomain(newCuisine)
  }

}
