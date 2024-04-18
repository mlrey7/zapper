import React from "react";
import { getAuthSession } from "@/lib/auth";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import PostCommentsFeed from "./PostCommentsFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getInfinitePosts } from "@/controllers/postController";
import { postQueryKeys } from "@/lib/postQuery";

const PostComments = async ({ replyToId }: { replyToId: string }) => {
  const session = await getAuthSession();
  if (!session) return null;

  const queryClient = await prefetchCommentsFeed(replyToId, session.user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostCommentsFeed replyToId={replyToId} authUserId={session.user.id} />
    </HydrationBoundary>
  );
};

const prefetchCommentsFeed = async (
  replyToId: string,
  authUserId: string,
): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: postQueryKeys.postComments(authUserId, replyToId),
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        authUserId,
        where: {
          replyToId,
        },
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

  return queryClient;
};

export default PostComments;
