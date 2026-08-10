/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `refresh_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `refresh_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `revokedAt` on the `refresh_sessions` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `refresh_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "refresh_sessions_expiresAt_idx";

-- DropIndex
DROP INDEX "refresh_sessions_revokedAt_idx";

-- AlterTable
ALTER TABLE "refresh_sessions" DROP COLUMN "expiresAt",
DROP COLUMN "lastUsedAt",
DROP COLUMN "revokedAt",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "last_used_at" TIMESTAMP(3),
ADD COLUMN     "revoked_at" TIMESTAMP(3),
ADD COLUMN     "user_agent" TEXT;

-- CreateIndex
CREATE INDEX "refresh_sessions_expires_at_idx" ON "refresh_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_sessions_revoked_at_idx" ON "refresh_sessions"("revoked_at");
