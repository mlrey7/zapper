import { getInfinitePosts } from "@/controllers/postController";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(
  request: Request,
  { params: { id: userId } }: { params: { id: string } },
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

    const postsWithLikesAndRetweets = await getInfinitePosts({
      limit: parseInt(limit),
      pageParam: parseInt(page),
      userId: session.user.id,
      where: {
        authorId: userId,
      },
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
