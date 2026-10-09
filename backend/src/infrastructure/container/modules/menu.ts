import { container } from "tsyringe"
import { MenuTokens } from "../../../modules/menu/infrastructure/persistence/tokens/menu.tokens.js"
import { MenuRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu.repository.js"
import { MenuCategoryRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-category.repository.js"
import { MenuItemRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-item.repository.js"
import { MenuAddOnGroupRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-add-on-group.repository.js"
import { MenuAddOnRepository } from "../../../modules/menu/infrastructure/persistence/prisma/menu-add-on.repository.js"
import { MenuCreationUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-creation.use-case.impl.js"
import { MenuByIdUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-by-id.use-case.impl.js"
import { MenuUpdationUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-updation.use-case.impl.js"
import { MenuDeactivateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-deactivate.use-case.impl.js"
import { MenuDeletionUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-deletion.use-case.impl.js"
import { MenuActivateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-activate.use-case.impl.js"

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

  container.registerSingleton(MenuTokens.MenuUpdationUseCase, MenuUpdationUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuActivateUseCase, MenuActivateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuDeactivateUseCase, MenuDeactivateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuDeletioUseCase, MenuDeletionUseCaseImpl)
}
