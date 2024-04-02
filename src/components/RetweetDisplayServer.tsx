import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import RetweetDisplay from "./RetweetDisplay";

interface RetweetDisplayServerProps {
  post: PostAndAuthorAll;
}

const RetweetDisplayServer = async ({ post }: RetweetDisplayServerProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.quoteTo?.content);

  if (!session) return null;

  const currentLike = await db.like.findFirst({
    where: {
      postId: post.quoteToId!,
      userId: session.user.id,
    },
  });

  const currentRetweet = await db.post.findFirst({
    where: {
      quoteToId: post.quoteToId!,
      authorId: session.user.id,
    },
  });

  if (!postContent.success) return null;

  return (
    <RetweetDisplay
      currentLike={!!currentLike}
      currentRetweet={!!currentRetweet}
      post={post}
      postContent={postContent.data}
    />
  );
};

export default RetweetDisplayServer;
