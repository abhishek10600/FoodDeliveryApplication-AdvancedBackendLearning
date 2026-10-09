export const MenuTokens = {
  MenuRepository: Symbol.for("Menu.MenuRepository"),
  MenuCategoryRepository: Symbol.for("Menu.MenuCategoryRepository"),
  MenuItemRepository: Symbol.for("Menu.MenuItemRepository"),
  MenuAddOnGroupRepository: Symbol.for("Menu.MenuAddOnGroupRepository"),
  MenuAddOn: Symbol.for("Menu.MenuAddOnRepository"),

  MenuCreationUseCase: Symbol.for("Menu.MenuCreationUseCase"),
  MenuByIdUseCase: Symbol.for("Menu.MenuByIdUseCase"),
  MenuUpdationUseCase: Symbol.for("Menu.MenuUpdationUseCase"),
  MenuActivateUseCase: Symbol.for("Menu.MenuActivateUseCase"),
  MenuDeactivateUseCase: Symbol.for("Menu.MenuDeactivateUseCase"),
  MenuDeletioUseCase: Symbol.for("Menu.MenuDeletionUseCase")
} as const
