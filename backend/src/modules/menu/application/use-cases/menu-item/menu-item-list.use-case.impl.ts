import { injectable, inject } from "tsyringe"
import { MenuItemListUseCase } from "./menu-item-list.use-case.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuItemListInput } from "../../dto/menu-item/menu-item-list.dto.js";
import { MenuItemResult } from "../../dto/menu-item/menu-item-result.dto.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { MenuItemResultMapper } from "../../dto/menu-item/mapper/menu-item-result-mapper.js";

@injectable()
export class MenuItemListUseCaseImpl implements MenuItemListUseCase {
  constructor(

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository,

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository

  ) { }

  async execute(input: MenuItemListInput): Promise<MenuItemResult[]> {
    const menuCategory = await this.menuCategoryRepo.findById(input.menuCategoryId)

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    const menuItems = await this.menuItemRepo.findByMenuCategoryId(input.menuCategoryId)

    console.log({ MenuItemListUseCase_menuItems:menuItems })

    console.log(menuItems.map((menuItem) => MenuItemResultMapper.toResult(menuItem)))

    return menuItems.map((menuItem) => MenuItemResultMapper.toResult(menuItem))

  }

}
