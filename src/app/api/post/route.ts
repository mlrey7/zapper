import { getInfinitePosts } from "@/controllers/postController";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { limit, page, feedType } = z
      .object({
        limit: z.string(),
        page: z.string(),
        feedType: z.enum(["following", "all"]),
      })
      .parse({
        feedType: url.searchParams.get("feedType"),
        page: url.searchParams.get("page"),
        limit: url.searchParams.get("limit"),
      });

    let where: Prisma.PostWhereInput = { replyToId: null };

    if (feedType === "following") {
      const user = await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          following: true,
          followedBy: true,
        },
      });

      if (!user) throw new Error("Current user not found");
      console.log("Following object: ", user.following);
      console.log("Followed by object: ", user.followedBy);

      const following = user.following.map((f) => f.followingId);
      console.log("FOLLOWING: ", following);
      where = {
        ...where,
        authorId: {
          in: following,
        },
      };
    }

    const postsWithLikesAndRetweets = await getInfinitePosts({
      limit: parseInt(limit),
      pageParam: parseInt(page),
      authUserId: session.user.id,
      where,
    });

    return Response.json(postsWithLikesAndRetweets);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.error(error);
    return new Response("Could not get posts", { status: 500 });
  }
}
