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

    await db.like.delete({
      where: {
        userId_postId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    return new Response("Successfuly removed like");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not remove like", { status: 500 });
  }
}
