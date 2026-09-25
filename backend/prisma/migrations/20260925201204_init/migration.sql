-- DropForeignKey
ALTER TABLE "restaurant_cuisines" DROP CONSTRAINT "restaurant_cuisines_cuisineId_fkey";

-- AddForeignKey
ALTER TABLE "restaurant_cuisines" ADD CONSTRAINT "restaurant_cuisines_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "cuisines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
