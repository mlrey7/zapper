"use client";

import FeedLoading from "@/components/FeedLoading";
import PostDisplayClient from "@/components/postDisplay/PostDisplayClient";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";
import { postQueryKeys } from "@/lib/postQuery";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";

const UserLikes = ({
  authUserId,
  userId,
}: {
  authUserId: string;
  userId: string;
}) => {
  const { ref, posts, isFetchingNextPage } = useInfiniteFeed({
    queryKey: postQueryKeys.userLikes(authUserId, userId),
    mainQueryFn: async (pageParam) => {
      const query = `/api/user/${userId}/likes?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;
      const data = await fetch(query);
      return PrismaPostAllArrayValidator.parse(await data.json());
    },
    authUserId,
  });

  return (
    <ul className="flex w-full flex-col">
      {...posts.map((post, index) => {
        return (
          <li key={post.id} ref={index === posts.length - 1 ? ref : null}>
            <PostDisplayClient post={post} authUserId={authUserId} />
          </li>
        );
      })}
      {isFetchingNextPage && <FeedLoading />}
    </ul>
  );
};

export default UserLikes;
