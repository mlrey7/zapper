import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthor, PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDisplay from "./PostDisplay";
import RetweetDisplay from "./RetweetDisplay";
import QuoteDisplay from "./QuoteDisplay";

interface PostDisplayServerProps {
  post: PostAndAuthorAll;
}

const PostDisplayServer = async ({ post }: PostDisplayServerProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.content);
  const quotedPostContent = PostContentValidator.safeParse(
    post.quoteTo?.content,
  );

  if (!session) return null;

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

  const isQuote =
    post.quoteToId !== null &&
    (postContent.data.text !== "" || postContent.data.images.length > 0);

  return post.quoteToId ? (
    isQuote ? (
      <QuoteDisplay
        currentLike={!!currentLike}
        currentRetweet={!!currentRetweet}
        post={post}
        postContent={postContent.data}
      />
    ) : (
      <RetweetDisplay
        currentLike={!!currentLike}
        currentRetweet={!!currentRetweet}
        post={post}
        postContent={postContent.data}
      />
    )
  ) : (
    <PostDisplay
      currentLike={!!currentLike}
      currentRetweet={!!currentRetweet}
      post={post}
      postContent={postContent.data}
    />
  );
};

export default PostDisplayServer;
