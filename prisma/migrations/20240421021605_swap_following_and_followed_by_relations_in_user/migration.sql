ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followedById_fkey";
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedById_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

