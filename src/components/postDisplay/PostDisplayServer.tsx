import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDisplayClient from "./PostDisplayClient";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { postQueryKeys } from "@/lib/postQuery";

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

  const quotedPost = post.quoteTo;

  const isRetweetPost =
    !!quotedPost &&
    postContent.data.text === "" &&
    postContent.data.images.length === 0;

  const activePost = isRetweetPost ? quotedPost : post;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: postQueryKeys.detailPostCurrentLike(
      activePost.id,
      session.user.id,
    ),
    queryFn: async () => {
      const currentLike = await db.like.findFirst({
        where: {
          postId: activePost.id,
          userId: session.user.id,
        },
      });

      return !!currentLike;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: postQueryKeys.detailPostCurrentRetweet(
      activePost.id,
      session.user.id,
    ),
    queryFn: async () => {
      const currentRetweet = await db.post.findFirst({
        where: {
          quoteToId: activePost.id,
          authorId: session.user.id,
        },
      });

      return !!currentRetweet;
    },
  });

  if (activePost.postMetrics) {
    queryClient.setQueryData(
      postQueryKeys.detailPostMetrics(activePost.id, session.user.id),
      activePost.postMetrics,
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDisplayClient
        post={post}
        className={className}
        connected={connected}
        authUserId={session.user.id}
      />
    </HydrationBoundary>
  );
};

export default PostDisplayServer;
