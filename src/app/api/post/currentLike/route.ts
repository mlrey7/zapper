import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();

    const { postIds } = z
      .object({
        postIds: z.string().array(),
      })
      .parse(body);

    const currentLike = await db.like.findMany({
      where: {
        postId: {
          in: postIds,
        },
        userId: session.user.id,
      },
    });

    // const l = new Map(
    //   currentLike.map((curr) => {
    //     return [curr.postId, curr];
    //   }),
    // );

    return Response.json(currentLike);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not get likes", { status: 500 });
  }
}
