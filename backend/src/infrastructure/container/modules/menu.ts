import { container } from "tsyringe"
import { MenuTokens } from "../../../modules/menu/infrastructure/persistence/tokens/menu.tokens.js"
import { MenuRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu.repository.js"
import { MenuCategoryRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-category.repository.js"
import { MenuItemRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-item.repository.js"
import { MenuAddOnGroupRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-add-on-group.repository.js"
import { MenuAddOnRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-add-on.repository.js"
import { MenuCreationUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-creation.use-case.impl.js"
import { MenuByIdUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-by-id.use-case.impl.js"

export const registerMenu = (): void => {
  container.register(MenuTokens.MenuRepository, {
    useClass: MenuRepository
  })

  container.register(MenuTokens.MenuCategoryRepository, {
    useClass: MenuCategoryRepository
  })

  container.register(MenuTokens.MenuItemRepository, {
    useClass: MenuItemRepository
  })

  container.register(MenuTokens.MenuAddOnGroupRepository, {
    useClass: MenuAddOnGroupRepository
  })

  container.register(MenuTokens.MenuAddOnGroupRepository, {
    useClass: MenuAddOnRepository
  })

  container.registerSingleton(MenuTokens.MenuCreationUseCase, MenuCreationUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuByIdUseCase, MenuByIdUseCaseImpl)
}
