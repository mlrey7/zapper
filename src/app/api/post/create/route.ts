import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, quoteToId, replyToId } = PostValidator.parse(body);

    await db.post.create({
      data: {
        authorId: session.user.id,
        content,
        quoteToId,
        replyToId,
        postMetrics: {
          create: {
            likesCount: 0,
            repliesCount: 0,
            retweetsCount: 0,
          },
        },
      },
    });

    if (replyToId) {
      await db.postMetrics.update({
        where: {
          postId: replyToId,
        },
        data: {
          repliesCount: {
            increment: 1,
          },
        },
      });
    }

    if (quoteToId) {
      await db.postMetrics.update({
        where: {
          postId: quoteToId,
        },
        data: {
          retweetsCount: {
            increment: 1,
          },
        },
      });
    }

    return new Response("Post successfully created");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not post", { status: 500 });
  }
}
