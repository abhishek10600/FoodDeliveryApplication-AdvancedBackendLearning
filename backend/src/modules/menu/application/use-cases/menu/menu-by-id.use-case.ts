import { MenuResult } from "../../dto/menu/menu-result.dto.js";
import { MenuInput } from "../../dto/menu/menu.dto.js";

export interface MenuByIdUseCase {
  execute(input: MenuInput): Promise<MenuResult>
}
