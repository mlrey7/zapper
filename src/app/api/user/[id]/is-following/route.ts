import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  _: Request,
  { params: { id: userId } }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const isFollowing = await db.follows.findUnique({
      where: {
        followingId_followedById: {
          followedById: session.user.id,
          followingId: userId,
        },
      },
    });

    return Response.json(isFollowing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.error(error);
    return new Response("Could not get isFollowing", { status: 500 });
  }
}
