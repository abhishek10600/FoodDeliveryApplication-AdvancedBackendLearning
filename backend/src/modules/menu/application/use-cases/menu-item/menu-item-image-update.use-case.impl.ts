import { injectable, inject } from "tsyringe"
import { MenuItemImageUpdateUseCase } from "./menu-item-image-update.use-case.js";
import { RestaurantTokens } from "../../../../restaurent/infrastructure/persistence/tokens/restaurant.tokens.js";
import type { IRestaurantRepository } from "../../../../restaurent/domain/repositories/restaurant.repository.js";
import type { IMenuCategoryRepository } from "../../../domain/repositories/menu-category.repository.js";
import { MenuTokens } from "../../../infrastructure/persistence/tokens/menu.tokens.js";
import type { IMenuItemRepository } from "../../../domain/repositories/menu-item.repository.js";
import { InfrastructureTokens } from "../../../../../infrastructure/container/index.js";
import type { FileStorage } from "../../../../../shared/contracts/storage/file-storage.js";
import { MenuItemImageUpdateInput } from "../../dto/menu-item/menu-item-image-update.dto.js";
import { RestaurantDomainError } from "../../../../restaurent/domain/errors/restaurant-domain.error.js";
import { MenuDomainError } from "../../../domain/errors/menu-domain.error.js";
import { validateMenuItemImage } from "../../../validators/menu-item-image.validator.js";
import { MenuItemImageUrl } from "../../../domain/value-objects/menu-item-image-url.vo.js";

@injectable()
export class MenuItemImageUpdateUseCaseImpl implements MenuItemImageUpdateUseCase {
  constructor(

    @inject(RestaurantTokens.RestaurantRepository)
    private readonly restaurantRepo: IRestaurantRepository,

    @inject(MenuTokens.MenuCategoryRepository)
    private readonly menuCategoryRepo: IMenuCategoryRepository,

    @inject(MenuTokens.MenuItemRepository)
    private readonly menuItemRepo: IMenuItemRepository,

    @inject(InfrastructureTokens.FileStorage)
    private readonly fileStorage: FileStorage

  ) { }

  async execute(input: MenuItemImageUpdateInput): Promise<void> {
    const restaurant = await this.restaurantRepo.findById(input.restaurantId)

    if (!restaurant) {
      throw new RestaurantDomainError("Restaurant not found", 404)
    }

    if (restaurant.getOwnerId() !== input.ownerId) {
      throw new MenuDomainError("You are not allowed to perform this action", 403)
    }

    const menuCategory = await this.menuCategoryRepo.findById(input.menuCategoryId)

    if (!menuCategory) {
      throw new MenuDomainError("Menu category not found", 404)
    }

    const menuItem = await this.menuItemRepo.findById(input.id)

    if (!menuItem) {
      throw new MenuDomainError("Menu item not found", 404)
    }

    validateMenuItemImage(input.file)

    const filename = input.file.originalname
    const extension = this.getExtension(filename)

    const key = `menuitems/${input.id}/menuitemimage/${crypto.randomUUID()}${extension}`

    const response = await this.fileStorage.upload({
      key,
      body: input.file.buffer,
      contentType: input.file.mimetype,
      contentLength: input.file.size
    })

    const menuItemImageUrl = response.url

    menuItem.updateImageUrl(MenuItemImageUrl.create(menuItemImageUrl))

    await this.menuItemRepo.update(input.id, menuItem)

  }

  private getExtension(filename: string): string {
    const index = filename.lastIndexOf(".");

    if (index === -1) {
      return "";
    }

    return filename.slice(index).toLowerCase()
  }
}
