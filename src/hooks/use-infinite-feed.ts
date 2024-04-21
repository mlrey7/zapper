"use client";

import { postQueryKeys } from "@/lib/postQuery";
import { PrismaPostAllType } from "@/lib/validators/post";
import { useIntersection } from "@mantine/hooks";
import {
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

export const useInfiniteFeed = ({
  queryKey,
  mainQueryFn,
  authUserId,
}: {
  queryKey: QueryKey;
  mainQueryFn: (pageParam: number) => Promise<Array<PrismaPostAllType>>;
  authUserId: string;
}) => {
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isPending,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const posts = await mainQueryFn(pageParam);

      posts.forEach((post) => {
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

      return posts;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetching]);

  const posts = data?.pages.flat() ?? [];

  return { ref, posts, isFetchingNextPage, refetch, isFetching, isPending };
};
