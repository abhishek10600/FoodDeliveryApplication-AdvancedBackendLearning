import { injectable, inject} from "tsyringe",
import { IMenuAddOnGroupRepository } from "../../../domain/repositories/menu-add-on-group.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { PrismaExecutor } from "../../../../../infrastructure/database/prisma-client.type.js";
import { MenuAddOnMapper } from "../mappers/menu-add-on.mapper.js";
import { MenuAddOn } from "../../../domain/entities/menu-add-on.entity.js";
import { IMenuAddOnRepository } from "../../../domain/repositories/menu-add-on.repository.js";

@injectable()
export class MenuAddOnRepository implements IMenuAddOnRepository {
  constructor(

    @inject(InfrastructureTokens.PrismaClient)
    private readonly prisma: PrismaExecutor

  ) { }

  async findById(id: string): Promise<MenuAddOn | null> {
    const menuAddOn = await this.prisma.menuAddOn.findUnique({
      where: {
        id
      }
    })

    if (!menuAddOn) {
      return null
    }

    return MenuAddOnMapper.toDomain(menuAddOn)
  }

  async findByMenuAddOnGroupId(menuAddOnGroupId: string): Promise<MenuAddOn[]> {
    const menuAddOns = await this.prisma.menuAddOn.findMany({
      where: {
        menuAddOnGroupId
      }
    })

    return menuAddOns.map((menuAddOn) => MenuAddOnMapper.toDomain(menuAddOn))
  }

  async existsByName(menuAddOnGroupId: string, name: string): Promise<Boolean> {
    const menuAddOn = await this.prisma.menuAddOn.findFirst({
      where: {
        menuAddOnGroupId,
        name
      }
    })

    if (!menuAddOn) {
      return false
    }

    return true
  }

  async create(menuAddOn: MenuAddOn): Promise<MenuAddOn> {
    const data = MenuAddOnMapper.toPersistence(menuAddOn)

    const newMenuAddOn = await this.prisma.menuAddOn.create({
      data
    })

    return MenuAddOnMapper.toDomain(newMenuAddOn)
  }

  async update(id: string, menuAddOn: MenuAddOn): Promise<void> {
    const data = MenuAddOnMapper.toPersistence(menuAddOn)

    await this.prisma.menuAddOn.update({
      where: {
        id
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menuAddOn.delete({
      where: {
        id
      }
    })
  }
}
