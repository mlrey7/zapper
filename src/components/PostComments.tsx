import React from "react";
import PostDisplayServer from "./PostDisplayServer";
import { db } from "@/lib/db";

const PostComments = async ({ replyToId }: { replyToId: string }) => {
  const replies = await db.post.findMany({
    where: {
      replyToId,
    },
    include: {
      author: true,
      postMetrics: true,
      quoteTo: {
        include: {
          author: true,
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
