import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthor } from "@/types/db";
import React from "react";
import PostDisplay from "./PostDisplay";

interface PostDisplayServerProps {
  post: PostAndAuthor;
}

const PostDisplayServer = async ({ post }: PostDisplayServerProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.content);

  if (!session) return null;

  const currentLike = await db.like.findFirst({
    where: {
      postId: post.id,
      userId: session.user.id,
    },
  });

  if (!postContent.success) return null;

  return (
    <PostDisplay
      currentLike={!!currentLike}
      post={post}
      postContent={postContent.data}
    />
  );
};

export default PostDisplayServer;
