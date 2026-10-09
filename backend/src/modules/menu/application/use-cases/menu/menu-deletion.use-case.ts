import { MenuDeletionInput } from "../../dto/menu/menu-deletion.dto.js";

export interface MenuDeletionUseCase {
  execute(input: MenuDeletionInput): Promise<void>
}
