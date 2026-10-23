import { MenuAddOnDeletionInput } from "../../dto/menu-add-on/menu-add-on-deletion.dto.js";

export interface MenuAddOnDeletionUseCase {
  execute(input: MenuAddOnDeletionInput): Promise<void>
}
