"use client";

import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PostDisplayClient from "./postDisplay/PostDisplayClient";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useEffect } from "react";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";
import { postQueryKeys } from "@/lib/postQuery";

const PostCommentsFeed = ({
  authUserId,
  replyToId,
}: {
  authUserId: string;
  replyToId: string;
}) => {
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: postQueryKeys.postComments(authUserId, replyToId),
    queryFn: async ({ pageParam }) => {
      const query = `/api/post/${replyToId}/replies?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;
      const data = await fetch(query);
      const posts = PrismaPostAllArrayValidator.parse(await data.json());
      posts.forEach((post) => {
        queryClient.setQueryData(["currentLike", post.id], post.currentLike);

        queryClient.setQueryData(
          ["currentRetweet", post.id],
          post.currentRetweet,
        );

        queryClient.setQueryData(["postMetrics", post.id], post.postMetrics);
      });
      return posts;
    },
    initialPageParam: 2,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  const posts = data?.pages.flat() ?? [];

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

export default PostCommentsFeed;
