import React from "react";
import PostDisplayServer from "./PostDisplayServer";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import RetweetDisplayServer from "./RetweetDisplayServer";

const PostFeed = async () => {
  const posts = await db.post.findMany({
    where: {
      replyToId: null,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
      postMetrics: true,
      quoteTo: {
        include: {
          author: true,
          postMetrics: true,
        },
      },
    },
  });

  return (
    <div className="flex w-full flex-col">
      {...posts.map((post) => {
        return post.quoteToId ? (
          <RetweetDisplayServer key={post.id} post={post} />
        ) : (
          <PostDisplayServer key={post.id} post={post} />
        );
      })}
    </div>
  );
};

export default PostFeed;
