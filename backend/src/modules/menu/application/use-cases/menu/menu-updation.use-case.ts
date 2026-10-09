import { MenuUpdationInput } from "../../dto/menu/menu-updation.dto.js";

export interface MenuUpdationUseCase {
  execute(input: MenuUpdationInput): Promise<void>
}
