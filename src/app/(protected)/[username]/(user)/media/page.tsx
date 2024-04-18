import { getInfinitePosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import UserMedia from "./UserMedia";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  if (!user) return null;

  const queryClient = await prefetchUserMedia(user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserMedia userId={user.id} username={username} />
    </HydrationBoundary>
  );
};

export default Page;

const prefetchUserMedia = async (userId: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["get-user-media-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        userId,
        where: {
          authorId: userId,
          content: {
            path: ["images"],
            not: [],
          },
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
