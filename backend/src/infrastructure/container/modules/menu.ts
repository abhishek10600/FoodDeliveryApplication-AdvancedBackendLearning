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
import { MenuCategoryCreationUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-creation.use-case.impl.js"
import { MenuByRestaurantIdUseCaseImpl } from "../../../modules/menu/application/use-cases/menu/menu-by-restaurant-id.use-case.impl.js"
import { MenuCategoryListUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-list.use-case.impl.js"
import { MenuCategoryByIdUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-by-id.use-case.impl.js"
import { MenuCategoryNameUpdateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-name-update.use-case.impl.js"
import { MenuCategoryDescriptionUpdateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-description-update.use-case.impl.js"
import { MenuCategoryDisplayOrderUpdateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-display-order-update.use-case.impl.js"
import { MenuCategoryStatusUpdateUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-status-update.use-case.impl.js"
import { MenuCategoryDeleteUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-category/menu-category-delete.use-case.impl.js"
import { MenuItemCreationUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-item/menu-item-creation.use-case.impl.js"
import { MenuItemListUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-item/menu-item-list.use-case.impl.js"
import { MenuItemByIdUseCaseImpl } from "../../../modules/menu/application/use-cases/menu-item/menu-item-by-id.use-case.impl.js"

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

  container.registerSingleton(MenuTokens.MenuByRestaurantIdUseCase, MenuByRestaurantIdUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryCreationUseCase, MenuCategoryCreationUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryListUseCase, MenuCategoryListUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryByIdUseCase, MenuCategoryByIdUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryNameUpdateUseCase, MenuCategoryNameUpdateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryDescriptionUpdateUseCase, MenuCategoryDescriptionUpdateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryDisplayOrderUpdateUseCase, MenuCategoryDisplayOrderUpdateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryStatusUpdateUseCase, MenuCategoryStatusUpdateUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuCategoryDeleteUseCase, MenuCategoryDeleteUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuItemCreationUseCase, MenuItemCreationUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuItemListUseCase, MenuItemListUseCaseImpl)

  container.registerSingleton(MenuTokens.MenuItemByIdUseCase, MenuItemByIdUseCaseImpl)

}
