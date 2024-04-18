import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getInfiniteLikedPosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import UserLikes from "./UserLikes";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  if (!user) return null;

  const queryClient = await prefetchUserLikes(user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserLikes userId={user.id} />
    </HydrationBoundary>
  );
};

export default Page;

const prefetchUserLikes = async (userId: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-user-likes-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfiniteLikedPosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        userId,
        where: {
          userId,
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
