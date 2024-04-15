import { db } from "@/lib/db";
import { omit } from "@/lib/utils";
import { PostAndAuthorAll, UserWithPosts } from "@/types/db";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getUser = cache((username: string) =>
  unstable_cache(
    async (username: string): Promise<UserWithPosts | null> => {
      console.log(`UNCACHED: getUser ${username}`);
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
    [`getUser: ${username}`],
    { revalidate: 3600 },
  )(username),
);
