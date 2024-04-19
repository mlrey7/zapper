"use client";

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
}: {
  queryKey: QueryKey;
  mainQueryFn: (pageParam: number) => Promise<Array<PrismaPostAllType>>;
}) => {
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const posts = await mainQueryFn(pageParam);

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
    initialPageParam: 1,
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

  return { ref, posts };
};
