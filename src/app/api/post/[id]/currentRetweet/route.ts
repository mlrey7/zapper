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
    const currentRetweet = await db.post.findFirst({
      where: {
        quoteToId: id,
        authorId: session.user.id,
      },
    });

    return Response.json(currentRetweet);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not get post", { status: 500 });
  }
}
