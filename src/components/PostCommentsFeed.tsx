"use client";

import PostDisplayClient from "./postDisplay/PostDisplayClient";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";
import { postQueryKeys } from "@/lib/postQuery";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";
import FeedLoading from "./FeedLoading";

const PostCommentsFeed = ({
  authUserId,
  replyToId,
}: {
  authUserId: string;
  replyToId: string;
}) => {
  const { ref, posts, isFetchingNextPage } = useInfiniteFeed({
    queryKey: postQueryKeys.postComments(authUserId, replyToId),
    mainQueryFn: async (pageParam) => {
      const query = `/api/post/${replyToId}/replies?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;
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

export default PostCommentsFeed;
