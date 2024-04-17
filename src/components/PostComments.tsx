import React from "react";
import { getAuthSession } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import PostCommentsFeed from "./PostCommentsFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";

const PostComments = async ({ replyToId }: { replyToId: string }) => {
  const session = await getAuthSession();
  if (!session) return null;

  const queryClient = await prefetchCommentsFeed(replyToId, session.user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostCommentsFeed replyToId={replyToId} />
    </HydrationBoundary>
  );
};

const prefetchCommentsFeed = async (
  replyToId: string,
  userId: string,
): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-replies-infinite", replyToId],
    queryFn: async ({ pageParam }) => {
      const posts = await db.post.findMany({
        where: {
          replyToId,
        },
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
          userId,
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
          authorId: userId,
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

  return queryClient;
};

export default PostComments;
