import { MenuAddOnGroup } from "../entities/menu-add-on-group.entity.js";

export interface IMenuAddOnGroupRepository {
  findById(id: string): Promise<MenuAddOnGroup | null>
  findByMenuItemId(menuItemId: string): Promise<MenuAddOnGroup[]>
  existsByName(menuItemId: string, name: string): Promise<Boolean>
  create(menuAddOnGroup: MenuAddOnGroup): Promise<MenuAddOnGroup>
  update(id: string, menuAddOnGroup: MenuAddOnGroup): Promise<void>
  delete(id: string): Promise<void>
}
