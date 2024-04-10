-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '';
