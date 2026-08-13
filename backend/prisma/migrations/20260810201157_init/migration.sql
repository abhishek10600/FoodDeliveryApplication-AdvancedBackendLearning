/*
  Warnings:

  - You are about to drop the column `user_at` on the `password_resets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "password_resets_user_at_idx";

-- AlterTable
ALTER TABLE "password_resets" DROP COLUMN "user_at",
ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "password_resets_used_at_idx" ON "password_resets"("used_at");
