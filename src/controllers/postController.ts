import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import {
  PostAndAuthor,
  PostAndAuthorAll,
  PostAndAuthorAllWithReply,
} from "@/types/db";
import { cache } from "react";
import { redis } from "@/lib/redis";
import { omit } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getPostsFeed = cache(() => {
  console.log("UNCACHED: getPostsFeed");
  return db.post.findMany({
    where: {
      replyToId: null,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
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
  });
});

export const getPostWithQuoteAndReply = cache((id: string) =>
  unstable_cache(
    async (id: string) => {
      console.log(`UNCACHED: getPostWithQuoteAndReply ${id}`);
      let post: PostAndAuthorAllWithReply | null;

      const cachedPostWithoutMetrics = (await redis.hgetall(
        `post:${id}`,
      )) as Omit<PostAndAuthorAllWithReply, "postMetrics"> | null;

      if (!cachedPostWithoutMetrics) {
        post = await db.post.findUnique({
          where: {
            id,
          },
          include: {
            author: {
              select: {
                image: true,
                name: true,
                username: true,
              },
            },
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
            replyTo: {
              include: {
                author: {
                  select: {
                    image: true,
                    name: true,
                    username: true,
                  },
                },
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

        if (post) {
          let strippedReply: PostAndAuthorAll | null = null;
          let strippedQuote: PostAndAuthor | null = null;

          if (post.replyTo) {
            let strippedReplyQuote: PostAndAuthor | null = null;
            if (post.replyTo.quoteTo) {
              strippedReplyQuote = omit(post.replyTo.quoteTo, ["postMetrics"]);
            }

            strippedReply = omit(post.replyTo, ["postMetrics"]);
            strippedReply = {
              ...strippedReply,
              quoteTo: strippedReplyQuote,
            };
          }

          if (post.quoteTo) {
            strippedQuote = omit(post.quoteTo, ["postMetrics"]);
          }

          const strippedPost = {
            ...post,
            quoteTo: strippedQuote,
            replyTo: strippedReply,
          };

          await redis.hset(`post:${id}`, omit(strippedPost, ["postMetrics"]));

          await redis.expire(`post:${id}`, 3600);
        }
      } else {
        const postMetrics = await db.postMetrics.findUnique({
          where: {
            postId: id,
          },
        });

        post = {
          ...cachedPostWithoutMetrics!,
          postMetrics,
        };
      }

      return post;
    },
    ["getPostWithQuoteAndReply", id],
    { revalidate: 3600 },
  )(id),
);

export const getPost = cache((id: string) =>
  unstable_cache(
    (id: string) => {
      console.log(`UNCACHED: getPost ${id}`);
      return db.post.findUnique({
        where: {
          id,
        },
        include: {
          author: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
        },
      });
    },
    ["getPost", id],
    { revalidate: 3600 },
  )(id),
);

export const getReplies = cache((replyToId: string) => {
  return db.post.findMany({
    where: {
      replyToId,
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
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
        },
      },
    },
  });
});

export const getUserPosts = cache((authorId: string) => {
  return db.post.findMany({
    where: {
      authorId,
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
  });
});

export const getUserLikedPosts = cache((userId: string) => {
  return db.like.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
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
          replyTo: {
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
});

export const getUserMediaPosts = cache((userId: string) => {
  return db.post.findMany({
    where: {
      authorId: userId,
      content: {
        path: ["images"],
        not: [],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export const getFeed = () => {
  db.post.findMany({
    where: {
      id: { in: ["asfs", "asdfsdf"] },
    },
  });
};

export const getInfinitePosts = async ({
  pageParam,
  where,
  limit,
  authUserId,
}: {
  pageParam: number;
  limit: number;
  authUserId: string;
  where: Prisma.PostWhereInput;
}) => {
  const posts = await db.post.findMany({
    where,
    skip: (pageParam - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
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
        },
      },
    },
  });

  const postIds = posts.map((post) => post.id);

  const currentLikes = await db.like.findMany({
    where: {
      postId: {
        in: postIds,
      },
      userId: authUserId,
    },
  });

  const currentLikesMap = new Map(
    currentLikes.map((curr) => {
      return [curr.postId, curr];
    }),
  );

  const currentRetweets = await db.post.findMany({
    where: {
      quoteToId: {
        in: postIds,
      },
      authorId: authUserId,
    },
  });

  const currentRetweetsMap = new Map(
    currentRetweets.map((curr) => {
      return [curr.quoteToId, curr];
    }),
  );

  const postsWithLikesAndRetweets = posts.map((post) => {
    return {
      ...post,
      currentLike: !!currentLikesMap.get(post.id),
      currentRetweet: !!currentRetweetsMap.get(post.id),
    };
  });

  return postsWithLikesAndRetweets;
};

export const getInfiniteLikedPosts = async ({
  pageParam,
  limit,
  authUserId,
  where,
}: {
  pageParam: number;
  limit: number;
  authUserId: string;
  where: Prisma.LikeWhereInput;
}) => {
  const likes = await db.like.findMany({
    where,
    skip: (pageParam - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
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
          replyTo: {
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

  const posts = likes.map((like) => like.post);
  const postIds = posts.map((post) => post.id);

  const currentLikes = await db.like.findMany({
    where: {
      postId: {
        in: postIds,
      },
      userId: authUserId,
    },
  });

  const currentLikesMap = new Map(
    currentLikes.map((curr) => {
      return [curr.postId, curr];
    }),
  );

  const currentRetweets = await db.post.findMany({
    where: {
      quoteToId: {
        in: postIds,
      },
      authorId: authUserId,
    },
  });

  const currentRetweetsMap = new Map(
    currentRetweets.map((curr) => {
      return [curr.quoteToId, curr];
    }),
  );

  const postsWithLikesAndRetweets = posts.map((post) => {
    return {
      ...post,
      currentLike: !!currentLikesMap.get(post.id),
      currentRetweet: !!currentRetweetsMap.get(post.id),
    };
  });

  return postsWithLikesAndRetweets;
};
