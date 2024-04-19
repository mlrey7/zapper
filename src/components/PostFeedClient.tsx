"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { FeedStatusType } from "@/types/feed";
import PostDisplayClient from "./postDisplay/PostDisplayClient";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";
import { postQueryKeys } from "@/lib/postQuery";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";

const PostFeedClient = ({
  authUserId,
  feedType = "all",
}: {
  authUserId: string;
  feedType?: FeedStatusType;
}) => {
  const { ref, posts } = useInfiniteFeed({
    queryKey: postQueryKeys.userFeed(authUserId, { feedType }),
    mainQueryFn: async (pageParam) => {
      const query = `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&feedType=${feedType}`;
      const data = await fetch(query);
      return PrismaPostAllArrayValidator.parse(await data.json());
    },
  });

  return (
    <ul className="flex w-full flex-col">
      {...posts.map((post, index) => {
        return (
          <li key={post.id} ref={index === posts.length - 1 ? ref : null}>
            <PostDisplayClient post={post} />
          </li>
        );
      })}
    </ul>
  );
};

export default PostFeedClient;
