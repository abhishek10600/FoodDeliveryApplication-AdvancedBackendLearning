/*
  Warnings:

  - A unique constraint covering the columns `[menuId,menu_category_name]` on the table `menu_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_menuId_menu_category_name_key" ON "menu_categories"("menuId", "menu_category_name");
