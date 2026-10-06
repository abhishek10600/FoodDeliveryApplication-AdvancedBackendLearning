import { injectable, inject } from "tsyringe"
import { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { MenuItem } from "../../../domain/entities/menu-item.entity.js";
import { MenuItemMapper } from "../mappers/menu-item.mapper.js";

@injectable()
export class MenuItemRepository implements IMenuItemRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<MenuItem | null> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: {
        id
      }
    })

    if (!menuItem) {
      return null
    }

    return MenuItemMapper.toDomain(menuItem)
  }

  async findByMenuCategoryId(menuCategoryId: string): Promise<MenuItem[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        menuCategoryId
      }
    })

    return menuItems.map((menuItem) => MenuItemMapper.toDomain(menuItem))
  }

  async findByName(menuCategoryId: string, name: string): Promise<MenuItem | null> {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: {
        menuCategoryId,
        name
      }
    })

    if (!menuItem) {
      return null
    }

    return MenuItemMapper.toDomain(menuItem)
  }

  async existsByName(menuCategoryId: string, name: string): Promise<Boolean> {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: {
        menuCategoryId,
        name
      }
    })

    if (!menuItem) {
      return false
    }

    return true
  }

  async create(menuItem: MenuItem): Promise<MenuItem> {
    const data = MenuItemMapper.toPersistence(menuItem)

    const newMenuItem = await this.prisma.menuItem.create({
      data
    })

    return MenuItemMapper.toDomain(newMenuItem)
  }

  async update(id: string, menuItem: MenuItem): Promise<void> {
    const data = MenuItemMapper.toUpdatePersistence(menuItem)

    await this.prisma.menuItem.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menuItem.delete({
      where: {
        id
      }
    })
  }
}
