import React from "react";
import { getPostsFeed } from "@/controllers/postController";
import PostFeedClient from "./PostFeedClient";
import { getAuthSession } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { PostAndAuthorAllWithLikesAndRetweets } from "@/types/db";

const PostFeed = async () => {
  const session = await getAuthSession();

  if (!session) return null;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-posts-infinite", session.user.id, "all"],
    queryFn: async ({ pageParam }) => {
      console.log("pageParam PREFETCH", pageParam);
      let whereClause: any = { replyToId: null };

      const posts = await db.post.findMany({
        where: whereClause,
        skip: (pageParam - 1) * INFINITE_SCROLLING_PAGINATION_RESULTS,
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

      const postIds = posts.map((post) => post.id);

      const currentLikes = await db.like.findMany({
        where: {
          postId: {
            in: postIds,
          },
          userId: session.user.id,
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
          authorId: session.user.id,
        },
      });

      const currentRetweetsMap = new Map(
        currentRetweets.map((curr) => {
          return [curr.quoteToId, curr];
        }),
      );

      console.log(currentRetweetsMap);

      const postsWithLikesAndRetweets = posts.map((post) => {
        return {
          ...post,
          currentLike: !!currentLikesMap.get(post.id),
          currentRetweet: !!currentRetweetsMap.get(post.id),
        };
      });

      postsWithLikesAndRetweets.forEach((post) => {
        queryClient.setQueryData(["currentLike", post.id], post.currentLike);

        console.log(post.id, post.currentRetweet);
        queryClient.setQueryData(
          ["currentRetweet", post.id],
          post.currentRetweet,
        );

        queryClient.setQueryData(["postMetrics", post.id], post.postMetrics);
      });

      return postsWithLikesAndRetweets;
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostFeedClient userId={session.user.id} />
    </HydrationBoundary>
  );
};

export default PostFeed;
