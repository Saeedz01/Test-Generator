-- AlterTable
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "refreshTokenHash" VARCHAR(64);
