/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,menu_name]` on the table `menus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "menu_items" ALTER COLUMN "menu_item_isAvailable" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "menus_restaurantId_menu_name_key" ON "menus"("restaurantId", "menu_name");
