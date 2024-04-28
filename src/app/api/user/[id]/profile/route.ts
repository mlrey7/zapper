import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserProfileValidator } from "@/lib/validators/user";
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
    const userProfile = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        bio: true,
        coverImage: true,
        image: true,
        name: true,
        username: true,
        location: true,
      },
    });

    return Response.json(userProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.error(error);
    return new Response("Could not get profile", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { id: userId } }: { params: { id: string } },
) {
  const session = await getAuthSession();

  if (!session?.user || session.user.id !== userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { bio, coverImage, image, location, name } =
      UserProfileValidator.parse(body);

    const data = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        bio,
        coverImage,
        image,
        location,
        name,
      },
    });

    return Response.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not update profile", { status: 500 });
  }
}
