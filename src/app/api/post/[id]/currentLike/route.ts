import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const currentLike = await db.like.findFirst({
      where: {
        postId: id,
        userId: session.user.id,
      },
    });

    return Response.json(currentLike);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not get like", { status: 500 });
  }
}
