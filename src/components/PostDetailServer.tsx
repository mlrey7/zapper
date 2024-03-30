import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthor } from "@/types/db";
import React from "react";
import PostDetailClient from "./PostDetailClient";

interface PostDetailServerProps {
  post: PostAndAuthor;
}

const PostDetailServer = async ({ post }: PostDetailServerProps) => {
  const session = await getAuthSession();

  if (!session) return null;
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
    <PostDetailClient
      currentLike={currentLike}
      post={post}
      postContent={postContent.data}
      user={{
        name: session.user.name ?? "",
        image: session.user.image ?? "",
        username: session.user.username ?? "",
      }}
    />
  );
};

export default PostDetailServer;
