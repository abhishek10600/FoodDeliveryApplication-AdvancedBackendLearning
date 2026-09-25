import { Prisma } from "../../../../../../../generated/prisma/index.js"
import { Cuisine } from "../../../../domain/entities/cuisine.entity.js"
import { CuisineStatus } from "../../../../domain/enums/cusine-status.enum.js"
import { CuisineName } from "../../../../domain/value-objects/cuisine-name.vo.js"
import { CuisineSlug } from "../../../../domain/value-objects/cuisine-slug.vo.js"

export class CuisineMapper {
  public static toDomain(data: Prisma.CuisineGetPayload<{}>): Cuisine {
    return Cuisine.rehydrate({
      id: data.id,
      name: CuisineName.create(data.name),
      slug: CuisineSlug.create(data.slug),
      status: data.status as CuisineStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  public static toPersistence(cuisine: Cuisine): Prisma.CuisineCreateInput {
    return {
      id: cuisine.getId(),
      name: cuisine.getName().getValue(),
      slug: cuisine.getSlug().getValue(),
      status: cuisine.getStatus(),
      createdAt: cuisine.getCreatedAt(),
      updatedAt: cuisine.getUpdatedAt()
    }
  }

  public static toUpdatePersistence(cuisine: Cuisine): Prisma.CuisineUpdateInput {
    return {
      name: cuisine.getName().getValue(),
      status: cuisine.getStatus(),
      updatedAt: cuisine.getUpdatedAt()
    }
  }
}
