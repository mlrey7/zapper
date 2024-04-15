import { db } from "@/lib/db";
import { cache } from "react";

export const isFollowingUser = cache(
  (followedById: string, followingId: string) => {
    return db.follows.findUnique({
      where: {
        followingId_followedById: {
          followedById: followedById,
          followingId: followingId,
        },
      },
    });
  },
);
