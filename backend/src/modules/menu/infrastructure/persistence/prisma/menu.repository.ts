import { injectable, inject } from "tsyringe"
import { IMenuRepository } from "../../../domain/repositories/menu.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { Menu } from "../../../domain/entities/menu.entity.js";
import { MenuMapper } from "../mappers/menu.mapper.js";

@injectable()
export class MenuRepository implements IMenuRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<Menu | null> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id
      }
    })

    if (!menu) {
      return null
    }

    return MenuMapper.toDomain(menu)
  }

  async findByRestaurantId(restaurantId: string): Promise<Menu | null> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        restaurantId
      }
    })

    if (!menu) {
      return null
    }

    return MenuMapper.toDomain(menu)
  }

  async findByName(name: string, restaurantId: string): Promise<Menu | null> {
    const menu = await this.prisma.menu.findFirst({
      where: {
        name,
        restaurantId
      }
    })

    if (!menu) {
      return null
    }

    return MenuMapper.toDomain(menu)
  }

  async existsForRestaurant(restaurantId: string): Promise<Boolean> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        restaurantId
      }
    })

    if (!menu) {
      return false
    }

    return true
  }

  async create(menu: Menu): Promise<Menu> {
    const data = MenuMapper.toPersistence(menu)

    const newMenu = await this.prisma.menu.create({
      data
    })

    return MenuMapper.toDomain(newMenu)
  }

  async update(id: string, menu: Menu,): Promise<void> {
    const data = MenuMapper.toUpdatePersistence(menu)

    await this.prisma.menu.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({
      where: {
        id
      }
    })
  }
}
