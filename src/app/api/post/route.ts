import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
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

    console.log(limit, page, feedType);

    let whereClause: any = { replyToId: null };

    if (feedType === "following") {
      const user = await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          following: true,
        },
      });

      if (!user) throw new Error("Current user not found");

      const following = user.following.map((f) => f.followingId);

      whereClause = {
        ...whereClause,
        authorId: {
          in: following,
        },
      };
    }

    const posts = await db.post.findMany({
      where: whereClause,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            image: true,
            name: true,
            username: true,
          },
        },
        postMetrics: true,
        quoteTo: {
          include: {
            author: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
            postMetrics: true,
          },
        },
      },
    });

    const postIds = posts.map((post) => post.id);

    const currentLikes = await db.like.findMany({
      where: {
        postId: {
          in: postIds,
        },
        userId: session.user.id,
      },
    });
    const currentLikesMap = new Map(
      currentLikes.map((curr) => {
        return [curr.postId, curr];
      }),
    );

    const currentRetweets = await db.post.findMany({
      where: {
        quoteToId: {
          in: postIds,
        },
        authorId: session.user.id,
      },
    });

    const currentRetweetsMap = new Map(
      currentRetweets.map((curr) => {
        return [curr.quoteToId, curr];
      }),
    );

    const postsWithLikesAndRetweets = posts.map((post) => {
      return {
        ...post,
        currentLike: !!currentLikesMap.get(post.id),
        currentRetweet: !!currentRetweetsMap.get(post.id),
      };
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
