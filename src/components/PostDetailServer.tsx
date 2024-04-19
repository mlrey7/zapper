import { getAuthSession } from "@/lib/auth";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDetailClient from "./PostDetailClient";
import { postQueryKeys } from "@/lib/postQuery";
import { db } from "@/lib/db";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

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
      <PostDetailClient
        post={post}
        postContent={postContent.data}
        user={{
          name: session.user.name ?? "",
          image: session.user.image ?? "",
          username: session.user.username ?? "",
        }}
        connected={connected}
        showImages={showImages}
        authUserId={session.user.id}
      />
    </HydrationBoundary>
  );
};

export default PostDetailServer;
