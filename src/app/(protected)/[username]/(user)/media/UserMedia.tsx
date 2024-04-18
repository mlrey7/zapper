"use client";

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { PostContentType } from "@/lib/validators/post";
import { PostAndAuthorAllWithLikesAndRetweets } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";

const UserMedia = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["get-user-media-infinite", userId],
    queryFn: async ({ pageParam }) => {
      const query = `/api/user/${userId}/media?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;
      const data = await fetch(query);
      const posts =
        (await data.json()) as Array<PostAndAuthorAllWithLikesAndRetweets>;
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

  const flattenedPosts = posts.flatMap((post) => {
    return (post.content as PostContentType).images.map((image, index) => {
      return {
        image,
        index,
        id: post.id,
      };
    });
  });

  return (
    <ul className="grid grid-cols-3 gap-1 p-1">
      {...flattenedPosts.map((post, totalIndex) => {
        return (
          <li
            key={post.id + post.image + post.index}
            ref={totalIndex === posts.length - 1 ? ref : null}
          >
            <Link
              href={`/${username}/status/${post.id}/photo/${post.index + 1}`}
            >
              <Image
                src={post.image}
                alt={`Post image ${totalIndex}`}
                width={0}
                height={0}
                className={"aspect-square w-full object-cover"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                key={post.id + post.image + post.index}
              ></Image>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default UserMedia;
