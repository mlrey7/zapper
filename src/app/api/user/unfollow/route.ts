import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserFollowValidator } from "@/lib/validators/user";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { followingId } = UserFollowValidator.parse(body);

    const followerMetric = await db.userMetrics.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    const followingMetric = await db.userMetrics.findUnique({
      where: {
        userId: followingId,
      },
    });

    if (!followerMetric || !followingMetric) {
      throw new Error("Missing follower metric or following metric");
    }

    await db.$transaction([
      db.follows.delete({
        where: {
          followingId_followedById: {
            followingId,
            followedById: session.user.id,
          },
        },
      }),
      db.userMetrics.update({
        where: {
          userId: followingId,
        },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      }),
      db.userMetrics.update({
        where: {
          userId: session.user.id,
        },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return new Response("Successfully unfollowed");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not unfollow", { status: 500 });
  }
}
