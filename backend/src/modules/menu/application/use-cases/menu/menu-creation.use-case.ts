import { MenuCreationResult } from "../../dto/menu/menu-creation-result.dto.js";
import { MenuCreationInput } from "../../dto/menu/menu-creation.dto.js";

export interface MenuCreationUseCase {
  execute(input: MenuCreationInput, ownerId: string): Promise<MenuCreationResult>
}
