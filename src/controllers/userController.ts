import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { omit } from "@/lib/utils";
import { PostAndAuthorAll, UserWithPosts } from "@/types/db";
import { cache } from "react";

export const getUser = cache(
  async (username: string): Promise<UserWithPosts | null> => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: {
          where: {
            replyToId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            postMetrics: true,
            quoteTo: {
              include: {
                author: {
                  select: {
                    image: true,
                    name: true,
                    username: true,
                  },
                },
                postMetrics: true,
              },
            },
          },
        },
      },
    });

    if (!user) return null;

    const posts: Array<PostAndAuthorAll> = user.posts.map((post) => {
      return {
        ...post,
        author: {
          image: user.image,
          name: user.name,
          username: user.username,
        },
      };
    });

    const cleanUser = omit(user, ["email", "emailVerified"]);

    return {
      ...cleanUser,
      posts,
    };
  },
);

export const getUserMetrics = cache((id: string) => {
  return db.userMetrics.findUnique({
    where: {
      userId: id,
    },
  });
});

export const getAuthUserProfile = cache(async () => {
  const session = await getAuthSession();

  if (!session) return null;

  return await db.user.findUnique({
    where: {
      id: session.user.id,
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
});
