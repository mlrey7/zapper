"use client";

import Link from "next/link";
import Image from "next/image";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useInfiniteFeed } from "@/hooks/use-infinite-feed";
import { postQueryKeys } from "@/lib/postQuery";
import { PrismaPostAllArrayValidator } from "@/lib/validators/post";

const UserMedia = ({
  authUserId,
  userId,
  username,
}: {
  authUserId: string;
  userId: string;
  username: string;
}) => {
  const { ref, posts } = useInfiniteFeed({
    queryKey: postQueryKeys.userMedia(authUserId, userId),
    mainQueryFn: async (pageParam) => {
      const query = `/api/user/${userId}/media?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;
      const data = await fetch(query);
      return PrismaPostAllArrayValidator.parse(await data.json());
    },
  });

  const flattenedPosts = posts.flatMap((post) => {
    return post.content.images.map((image, index) => {
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
