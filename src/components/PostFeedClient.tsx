"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import {
  PostAndAuthorAll,
  PostAndAuthorAllWithLikesAndRetweets,
} from "@/types/db";
import { FeedStatusType } from "@/types/feed";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useState } from "react";
import PostDisplayClient from "./postDisplay/PostDisplayClient";
import { Like } from "@prisma/client";

const PostFeedClient = ({
  userId,
  feedType = "all",
}: {
  userId: string;
  feedType?: FeedStatusType;
}) => {
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["get-posts-infinite", userId, feedType],
    queryFn: async ({ pageParam }) => {
      const query = `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}&feedType=${feedType}`;
      const data = await fetch(query);
      const posts =
        (await data.json()) as Array<PostAndAuthorAllWithLikesAndRetweets>;
      posts.forEach((post) => {
        queryClient.setQueryData(["currentLike", post.id], post.currentLike);

        queryClient.setQueryData(
          ["currentRetweet", post.id],
          post.currentRetweet,
        );
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

export default PostFeedClient;
