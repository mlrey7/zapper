import { getInfinitePosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import UserMedia from "./UserMedia";
import { getAuthSession } from "@/lib/auth";
import { postQueryKeys } from "@/lib/postQuery";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  const session = await getAuthSession();

  if (!session) return null;
  if (!user) return null;

  const queryClient = await prefetchUserMedia(session.user.id, user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserMedia
        authUserId={session.user.id}
        userId={user.id}
        username={username}
      />
    </HydrationBoundary>
  );
};

export default Page;

const prefetchUserMedia = async (
  authUserId: string,
  userId: string,
): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: postQueryKeys.userMedia(authUserId, userId),
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        authUserId,
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
