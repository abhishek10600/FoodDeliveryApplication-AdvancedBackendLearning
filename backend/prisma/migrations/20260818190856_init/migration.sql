/*
  Warnings:

  - A unique constraint covering the columns `[replaced_by_session_id]` on the table `refresh_sessions` will be added. If there are existing duplicate values, this will fail.
  - The required column `familyId` was added to the `refresh_sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "refresh_sessions" ADD COLUMN     "familyId" UUID NOT NULL,
ADD COLUMN     "replaced_by_session_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_replaced_by_session_id_key" ON "refresh_sessions"("replaced_by_session_id");

-- CreateIndex
CREATE INDEX "refresh_sessions_familyId_idx" ON "refresh_sessions"("familyId");
