-- RenameForeignKey
ALTER TABLE "Follows" RENAME CONSTRAINT "Follows_followedById_fkey" TO "Follows_followingId_fkey";

-- RenameForeignKey
ALTER TABLE "Follows" RENAME CONSTRAINT "Follows_followingId_fkey" TO "Follows_followedById_fkey";
