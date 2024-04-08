import React from "react";
import PostDisplayServer from "./postDisplay/PostDisplayServer";
import { getReplies } from "@/controllers/postController";

const PostComments = async ({ replyToId }: { replyToId: string }) => {
  const replies = await getReplies(replyToId);

  return (
    <ul>
      {replies.map((reply) => (
        <PostDisplayServer key={reply.id} post={reply} />
      ))}
    </ul>
  );
};

export default PostComments;
