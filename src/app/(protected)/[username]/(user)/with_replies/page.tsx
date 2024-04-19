import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getInfinitePosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UserReplies from "./UserReplies";
import { postQueryKeys } from "@/lib/postQuery";
import { getAuthSession } from "@/lib/auth";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  const session = await getAuthSession();

  if (!session) return null;
  if (!user) return null;

  const queryClient = await prefetchUserReplies(session.user.id, user.id);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReplies authUserId={session.user.id} userId={user.id} />
    </HydrationBoundary>
  );
};

export default Page;

const prefetchUserReplies = async (
  authUserId: string,
  userId: string,
): Promise<QueryClient> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: postQueryKeys.userReplies(authUserId, userId),
    queryFn: async ({ pageParam }) => {
      const postsWithLikesAndRetweets = await getInfinitePosts({
        limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        pageParam,
        authUserId,
        where: { authorId: userId },
      });

      postsWithLikesAndRetweets.forEach((post) => {
        queryClient.setQueryData(
          postQueryKeys.detailPostCurrentLike(post.id, authUserId),
          post.currentLike,
        );

        queryClient.setQueryData(
          postQueryKeys.detailPostCurrentRetweet(post.id, authUserId),
          post.currentRetweet,
        );

        queryClient.setQueryData(
          postQueryKeys.detailPostMetrics(post.id, authUserId),
          post.postMetrics,
        );
      });

      return postsWithLikesAndRetweets;
    },
    initialPageParam: 1,
  });

  return queryClient;
};
