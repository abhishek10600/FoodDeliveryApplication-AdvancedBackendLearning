import { inject, injectable } from "tsyringe"
import { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { MenuCategory } from "../../../domain/entities/menu-cateogry.entity.js";
import { MenuCategoryMapper } from "../mappers/menu-category.mapper.js";

@injectable()
export class MenuCategoryRepository implements IMenuCategoryRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<MenuCategory | null> {
    const menuCategory = await this.prisma.menuCategory.findUnique({
      where: {
        id
      }
    })

    if (!menuCategory) {
      return null
    }

    return MenuCategoryMapper.toDomain(menuCategory)
  }

  async findByMenuId(menuId: string): Promise<MenuCategory[]> {
    const menuCategories = await this.prisma.menuCategory.findMany({
      where: {
        menuId
      }
    })

    return menuCategories.map((menuCategory) => MenuCategoryMapper.toDomain(menuCategory))
  }

  async findByName(menuId: string, name: string): Promise<MenuCategory | null> {
    const menuCategory = await this.prisma.menuCategory.findFirst({
      where: {
        menuId,
        name
      }
    })

    if (!menuCategory) {
      return null
    }

    return MenuCategoryMapper.toDomain(menuCategory)
  }

  async existsByName(menuId: string, name: string): Promise<Boolean> {
    const menuCategory = await this.prisma.menuCategory.findFirst({
      where: {
        menuId,
        name
      }
    })

    if (!menuCategory) {
      return false
    }

    return true
  }

  async create(menuCategory: MenuCategory): Promise<MenuCategory> {
    const data = MenuCategoryMapper.toPersistence(menuCategory)

    const newMenuCategory = await this.prisma.menuCategory.create({
      data
    })

    return MenuCategoryMapper.toDomain(newMenuCategory)
  }

  async update(id: string, menuCategory: MenuCategory): Promise<void> {
    const data = MenuCategoryMapper.toUpdatePersistence(menuCategory)

    await this.prisma.menuCategory.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menuCategory.delete({
      where: {
        id
      }
    })
  }
}
