import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostLikeValidator } from "@/lib/validators/like";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { postId } = PostLikeValidator.parse(body);

    const postMetric = await db.postMetrics.findFirst({
      where: {
        postId,
      },
    });

    if (!postMetric) {
      throw new Error();
    }

    await db.$transaction([
      db.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      }),
      db.postMetrics.update({
        where: {
          postId,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return new Response("Successfuly like");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not like", { status: 500 });
  }
}
