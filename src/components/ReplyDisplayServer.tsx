import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthor } from "@/types/db";
import React from "react";
import ReplyDisplay from "./ReplyDisplay";

interface ReplyDisplayServerProps {
  post: PostAndAuthor;
}

const ReplyDisplayServer = async ({ post }: ReplyDisplayServerProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.content);
  const user = await db.user.findFirst({
    select: {
      likes: true,
    },
    where: {
      id: session?.user.id,
    },
  });

  const currentLike = !!user!.likes.find((like) => like.postId === post.id);

  if (!postContent.success) return null;

  return (
    <ReplyDisplay
      currentLike={currentLike}
      post={post}
      postContent={postContent.data}
    />
  );
};

export default ReplyDisplayServer;
