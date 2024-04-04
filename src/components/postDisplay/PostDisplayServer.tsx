import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDisplayClient from "./PostDisplayClient";

interface PostDisplayServerProps {
  post: PostAndAuthorAll;
  className?: string;
  connected?: boolean;
}

const PostDisplayServer = async ({
  post,
  className,
  connected,
}: PostDisplayServerProps) => {
  const session = await getAuthSession();
  const postContent = PostContentValidator.safeParse(post.content);

  if (!session) return null;
  if (!postContent.success) return null;

  const isRetweetPost =
    post.quoteToId !== null &&
    postContent.data.text === "" &&
    postContent.data.images.length === 0;

  const currentLike = await db.like.findFirst({
    where: {
      postId: isRetweetPost ? post.quoteToId! : post.id,
      userId: session.user.id,
    },
  });

  const currentRetweet = await db.post.findFirst({
    where: {
      quoteToId: isRetweetPost ? post.quoteToId! : post.id,
      authorId: session.user.id,
    },
  });

  return (
    <PostDisplayClient
      currentLike={!!currentLike}
      currentRetweet={!!currentRetweet}
      post={post}
      postContent={postContent.data}
      className={className}
      connected={connected}
    />
  );
};

export default PostDisplayServer;
