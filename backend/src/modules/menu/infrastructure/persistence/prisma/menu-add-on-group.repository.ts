import { injectable, inject } from "tsyringe";
import { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { MenuAddOnGroup } from "../../../domain/entities/menu-add-on-group.entity.js";
import { MenuAddOnGroupMapper } from "../mappers/menu-add-on-group.mapper.js";

@injectable()
export class MenuAddOnGroupRepository implements IMenuAddOnGroupRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<MenuAddOnGroup | null> {
    const menuAddOnGroup = await this.prisma.menuAddOnGroup.findUnique({
      where: {
        id
      }
    })

    if (!menuAddOnGroup) {
      return null
    }

    return MenuAddOnGroupMapper.toDomain(menuAddOnGroup)
  }

  async findByMenuItemId(menuItemId: string): Promise<MenuAddOnGroup[]> {
    const menuAddOnGroups = await this.prisma.menuAddOnGroup.findMany({
      where: {
        menuItemId
      }
    })

    return menuAddOnGroups.map((menuAddOnGroup) => MenuAddOnGroupMapper.toDomain(menuAddOnGroup))
  }

  async existsByName(menuItemId: string, name: string): Promise<Boolean> {
    const menuAddOnGroup = await this.prisma.menuAddOnGroup.findFirst({
      where: {
        menuItemId,
        name
      }
    })

    if (!menuAddOnGroup) {
      return false
    }

    return true
  }

  async create(menuAddOnGroup: MenuAddOnGroup): Promise<MenuAddOnGroup> {
    const data = MenuAddOnGroupMapper.toPersistence(menuAddOnGroup)

    const newMenuAddOnGroup = await this.prisma.menuAddOnGroup.create({
      data
    })

    return MenuAddOnGroupMapper.toDomain(newMenuAddOnGroup)
  }

  async update(id: string, menuAddOnGroup: MenuAddOnGroup): Promise<void> {
    const data = MenuAddOnGroupMapper.toUpdatePersistence(menuAddOnGroup)

    await this.prisma.menuAddOnGroup.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menuAddOnGroup.delete({
      where: {
        id
      }
    })
  }
}
