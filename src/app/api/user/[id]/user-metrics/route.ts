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
    const userMetrics = await db.userMetrics.findUnique({
      where: {
        userId,
      },
    });

    return Response.json(userMetrics);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.error(error);
    return new Response("Could not get userMetrics", { status: 500 });
  }
}
