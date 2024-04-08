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

export const getPostWithQuoteAndReply = cache(async (id: string) => {
  console.log(`UNCACHED: getPost ${id}`);
  let post: PostAndAuthorAllWithReply | null;

  const cachedPostWithoutMetrics = (await redis.hgetall(`post:${id}`)) as Omit<
    PostAndAuthorAllWithReply,
    "postMetrics"
  > | null;

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
});

export const getPost = cache((id: string) => {
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
});

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