import React from "react";
import { getInfinitePosts } from "@/controllers/postController";
import PostFeedClient from "./PostFeedClient";
import { getAuthSession } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { postQueryKeys } from "@/lib/postQuery";

const PostFeed = async () => {
  const session = await getAuthSession();

  if (!session) return null;

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: postQueryKeys.userFeed(session.user.id, { feedType: "all" }),
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        authUserId: session.user.id,
        where: { replyToId: null },
      });

      postsWithLikesAndRetweets.forEach((post) => {
        queryClient.setQueryData(["currentLike", post.id], post.currentLike);

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
      <PostFeedClient authUserId={session.user.id} />
    </HydrationBoundary>
  );
};

export default PostFeed;
