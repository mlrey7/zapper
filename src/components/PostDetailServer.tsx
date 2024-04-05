import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDetailClient from "./PostDetailClient";

interface PostDetailServerProps {
  post: PostAndAuthorAll;
  connected?: boolean;
  showImages?: boolean;
}

const PostDetailServer = async ({
  post,
  connected = false,
  showImages = true,
}: PostDetailServerProps) => {
  const session = await getAuthSession();

  if (!session) return null;
  const postContent = PostContentValidator.safeParse(post.content);

  const currentLike = await db.like.findFirst({
    where: {
      postId: post.id,
      userId: session.user.id,
    },
  });

  const currentRetweet = await db.post.findFirst({
    where: {
      quoteToId: post.id,
      authorId: session.user.id,
    },
  });

  if (!postContent.success) return null;

  return (
    <PostDetailClient
      currentLike={!!currentLike}
      currentRetweet={!!currentRetweet}
      post={post}
      postContent={postContent.data}
      user={{
        name: session.user.name ?? "",
        image: session.user.image ?? "",
        username: session.user.username ?? "",
      }}
      connected={connected}
      showImages={showImages}
    />
  );
};

export default PostDetailServer;
