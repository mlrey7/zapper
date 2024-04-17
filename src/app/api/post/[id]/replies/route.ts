import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: Request,
  { params: { id: replyToId } }: { params: { id: string } },
) {
  const url = new URL(request.url);

  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        page: url.searchParams.get("page"),
        limit: url.searchParams.get("limit"),
      });

    const posts = await db.post.findMany({
      where: {
        replyToId,
      },
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
    return new Response("Could not get replies", { status: 500 });
  }
}
