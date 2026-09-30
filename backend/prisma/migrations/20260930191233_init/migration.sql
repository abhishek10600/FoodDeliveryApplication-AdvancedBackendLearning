-- CreateEnum
CREATE TYPE "MenuStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MenuCategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MenuItemStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ModelAddOnGroupStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MenuAddOnStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "menus" (
    "id" UUID NOT NULL,
    "restaurantId" UUID NOT NULL,
    "menu_name" TEXT NOT NULL,
    "menu_status" "MenuStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" UUID NOT NULL,
    "menuId" UUID NOT NULL,
    "menu_category_name" TEXT NOT NULL,
    "menu_category_description" TEXT,
    "menu_category_display_order" INTEGER NOT NULL DEFAULT 0,
    "menu_category_status" "MenuCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "menu_item_name" TEXT NOT NULL,
    "menu_item_description" TEXT,
    "menu_item_image_url" TEXT,
    "menu_item_price" INTEGER NOT NULL,
    "menu_item_currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "menu_item_status" "MenuItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "menu_item_isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "menu_item_display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_add_on_groups" (
    "id" UUID NOT NULL,
    "menuItemId" UUID NOT NULL,
    "menu_add_on_group_name" TEXT NOT NULL,
    "menu_add_on_group_min_selections" INTEGER NOT NULL DEFAULT 0,
    "menu_add_on_group_max_selections" INTEGER NOT NULL DEFAULT 1,
    "menu_add_on_group_status" "ModelAddOnGroupStatus" NOT NULL DEFAULT 'ACTIVE',
    "menu_add_on_group_display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_add_on_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_add_ons" (
    "id" UUID NOT NULL,
    "menuAddOnGroupId" UUID NOT NULL,
    "menu_add_on_name" TEXT NOT NULL,
    "menu_add_on_price" INTEGER NOT NULL,
    "menu_add_on_currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "menu_add_on_display_order" INTEGER NOT NULL DEFAULT 0,
    "menu_add_on_status" "MenuAddOnStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_add_ons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menus_menu_status_idx" ON "menus"("menu_status");

-- CreateIndex
CREATE INDEX "menu_categories_menuId_idx" ON "menu_categories"("menuId");

-- CreateIndex
CREATE INDEX "menu_categories_menuId_menu_category_status_idx" ON "menu_categories"("menuId", "menu_category_status");

-- CreateIndex
CREATE INDEX "menu_categories_menuId_menu_category_display_order_idx" ON "menu_categories"("menuId", "menu_category_display_order");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_idx" ON "menu_items"("categoryId");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_menu_item_status_idx" ON "menu_items"("categoryId", "menu_item_status");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_menu_item_isAvailable_idx" ON "menu_items"("categoryId", "menu_item_isAvailable");

-- CreateIndex
CREATE INDEX "menu_items_categoryId_menu_item_display_order_idx" ON "menu_items"("categoryId", "menu_item_display_order");

-- CreateIndex
CREATE INDEX "menu_add_on_groups_menuItemId_idx" ON "menu_add_on_groups"("menuItemId");

-- CreateIndex
CREATE INDEX "menu_add_on_groups_menuItemId_menu_add_on_group_status_idx" ON "menu_add_on_groups"("menuItemId", "menu_add_on_group_status");

-- CreateIndex
CREATE INDEX "menu_add_on_groups_menuItemId_menu_add_on_group_display_ord_idx" ON "menu_add_on_groups"("menuItemId", "menu_add_on_group_display_order");

-- CreateIndex
CREATE INDEX "menu_add_ons_menuAddOnGroupId_idx" ON "menu_add_ons"("menuAddOnGroupId");

-- CreateIndex
CREATE INDEX "menu_add_ons_menuAddOnGroupId_menu_add_on_display_order_idx" ON "menu_add_ons"("menuAddOnGroupId", "menu_add_on_display_order");

-- CreateIndex
CREATE INDEX "menu_add_ons_menuAddOnGroupId_menu_add_on_status_idx" ON "menu_add_ons"("menuAddOnGroupId", "menu_add_on_status");

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_add_on_groups" ADD CONSTRAINT "menu_add_on_groups_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_add_ons" ADD CONSTRAINT "menu_add_ons_menuAddOnGroupId_fkey" FOREIGN KEY ("menuAddOnGroupId") REFERENCES "menu_add_on_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
