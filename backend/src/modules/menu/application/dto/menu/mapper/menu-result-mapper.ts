import { Menu } from "../../../../domain/entities/menu.entity.js";
import { MenuResult } from "../menu-result.dto.js";

export class MenuResultMapper {
  public static toResult(menu: Menu): MenuResult {
    return {
      id: menu.getId(),
      restaurantId: menu.getRestaurantId(),
      name: menu.getName().getValue(),
      status: menu.getStatus(),
      createdAt: menu.getCreatedAt(),
      updatedAt: menu.getUpdatedAt()
    }
  }
}
