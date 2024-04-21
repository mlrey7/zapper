"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import PostDisplayClient from "./postDisplay/PostDisplayClient";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";
import { postQueryKeys } from "@/lib/postQuery";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";
import FeedLoading from "./FeedLoading";
import { useFeedStatus } from "./FeedStatusProvider";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const PostFeedClient = ({ authUserId }: { authUserId: string }) => {
  const feedType = useFeedStatus()((state) => state.feedStatus);
  const queryClient = useQueryClient();

  const { ref, posts, isFetchingNextPage, isPending } = useInfiniteFeed({
    queryKey: postQueryKeys.userFeed(authUserId, { feedType }),
    mainQueryFn: async (pageParam) => {
      const query = `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&feedType=${feedType}`;
      const data = await fetch(query);
      return PrismaPostAllArrayValidator.parse(await data.json());
    },
    authUserId,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [...postQueryKeys.userFeed(authUserId, { feedType })],
    });
  }, [feedType, authUserId, queryClient]);

  return (
    <>
      {isPending ? (
        <ul className="flex justify-center">
          <FeedLoading />
        </ul>
      ) : (
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
      )}
    </>
  );
};

export default PostFeedClient;
