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

    const currentRetweet = await db.post.findMany({
      where: {
        quoteToId: {
          in: postIds,
        },
        authorId: session.user.id,
      },
    });

    const l = new Map(
      currentRetweet.map((curr) => {
        return [curr.id, curr];
      }),
    );

    return Response.json(l);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not get posts", { status: 500 });
  }
}
