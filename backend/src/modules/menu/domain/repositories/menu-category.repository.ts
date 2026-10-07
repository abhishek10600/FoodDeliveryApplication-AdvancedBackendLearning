import { MenuCategory } from "../entities/menu-cateogry.entity.js";

export interface IMenuCategoryRepository {
  findById(id: string): Promise<MenuCategory | null>
  findByMenuId(menuId: string): Promise<MenuCategory[]>
  existsByName(menuId: string, name: string): Promise<Boolean>
  create(menuCategory: MenuCategory): Promise<MenuCategory>
  update(id: string, menuCategory: MenuCategory): Promise<void>
  delete(id: string): Promise<void>
}
