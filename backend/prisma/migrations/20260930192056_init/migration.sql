/*
  Warnings:

  - You are about to drop the column `categoryId` on the `menu_items` table. All the data in the column will be lost.
  - Added the required column `menuCategoryId` to the `menu_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_categoryId_fkey";

-- DropIndex
DROP INDEX "menu_items_categoryId_idx";

-- DropIndex
DROP INDEX "menu_items_categoryId_menu_item_display_order_idx";

-- DropIndex
DROP INDEX "menu_items_categoryId_menu_item_isAvailable_idx";

-- DropIndex
DROP INDEX "menu_items_categoryId_menu_item_status_idx";

-- AlterTable
ALTER TABLE "menu_items" DROP COLUMN "categoryId",
ADD COLUMN     "menuCategoryId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "menu_items_menuCategoryId_idx" ON "menu_items"("menuCategoryId");

-- CreateIndex
CREATE INDEX "menu_items_menuCategoryId_menu_item_status_idx" ON "menu_items"("menuCategoryId", "menu_item_status");

-- CreateIndex
CREATE INDEX "menu_items_menuCategoryId_menu_item_isAvailable_idx" ON "menu_items"("menuCategoryId", "menu_item_isAvailable");

-- CreateIndex
CREATE INDEX "menu_items_menuCategoryId_menu_item_display_order_idx" ON "menu_items"("menuCategoryId", "menu_item_display_order");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
