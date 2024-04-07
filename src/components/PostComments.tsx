import React from "react";
import PostDisplayServer from "./postDisplay/PostDisplayServer";
import { db } from "@/lib/db";

const PostComments = async ({ replyToId }: { replyToId: string }) => {
  const replies = await db.post.findMany({
    where: {
      replyToId,
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
          author: {
            select: {
              image: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return (
    <ul>
      {replies.map((reply) => (
        <PostDisplayServer key={reply.id} post={reply} />
      ))}
    </ul>
  );
};

export default PostComments;
