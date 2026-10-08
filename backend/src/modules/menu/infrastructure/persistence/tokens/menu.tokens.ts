export const MenuTokens = {

  MenuRepository: Symbol.for("Menu.MenuRepository"),
  MenuCategoryRepository: Symbol.for("Menu.MenuCategoryRepository"),
  MenuItemRepository: Symbol.for("Menu.MenuItemRepository"),
  MenuAddOnGroupRepository: Symbol.for("Menu.MenuAddOnGroupRepository"),
  MenuAddOn: Symbol.for("Menu.MenuAddOnRepository"),

  MenuCreationUseCase: Symbol.for("Menu.MenuCreationUseCase"),
  MenuByIdUseCase: Symbol.for("Menu.MenuByIdUseCase")

} as const
