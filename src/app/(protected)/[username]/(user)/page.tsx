import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getUser } from "@/controllers/userController";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UserPosts from "./UserPosts";
import { getInfinitePosts } from "@/controllers/postController";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);

  if (!user) return null;

  const queryClient = await prefetchUserPostsFeed(user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserPosts userId={user.id} />
    </HydrationBoundary>
  );
};

export default Page;

const prefetchUserPostsFeed = async (userId: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-user-posts-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        userId,
        where: { authorId: userId, replyToId: null },
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
