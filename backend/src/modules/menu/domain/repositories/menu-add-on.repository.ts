import { MenuAddOn } from "../entities/menu-add-on.entity.js";

export interface IMenuAddOnRepository {

  findById(id: string): Promise<MenuAddOn | null>
  findByMenuAddOnGroupId(menuAddOnGroupId: string): Promise<MenuAddOn[]>
  existsByName(menuAddOnGroupId: string, name: string): Promise<Boolean>
  create(menuAddOn: MenuAddOn): Promise<MenuAddOn>
  update(id: string, menuAddOn: MenuAddOn): Promise<void>
  delete(id: string): Promise<void>
}
