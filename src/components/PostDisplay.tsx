"use client";

import { ExtendedPost, PostAndAuthor } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { PostContentType } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostDisplayProps {
  post: PostAndAuthor;
  currentLike: boolean;
  currentRetweet: boolean;
  postContent: PostContentType;
}

const PostDisplay = ({
  post,
  currentLike,
  currentRetweet,
  postContent,
}: PostDisplayProps) => {
  const router = useRouter();
  const isRetweet =
    post.quoteToId !== null &&
    postContent.text === "" &&
    postContent.images.length === 0;
  const isQuote =
    post.quoteToId !== null &&
    (postContent.text !== "" || postContent.images.length > 0);

  const postInteractivityId = isRetweet ? post.quoteToId! : post.id;

  return (
    <div
      className="flex cursor-pointer items-start gap-3 border-b px-4 py-3"
      onClick={() => {
        router.push(`/${post.author.username}/status/${post.id}`);
      }}
    >
      <UserAvatar
        user={post.author}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          router.push(`/${post.author.username}`);
        }}
      />

      <div className="flex w-full flex-col overflow-hidden">
        <div className="flex items-center gap-1">
          <h6 className="text-sm font-bold">{post.author.name}</h6>
          <p className="text-sm text-gray-600">@{post.author.username}</p>
          <span className="text-sm text-gray-600">•</span>
          <p className="text-sm text-gray-600">
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
          <div className="flex-1" />
          <PostDisplayMoreOptions />
        </div>
        <p className="w-full text-wrap break-words text-sm">
          {postContent.text}
        </p>
        {postContent.images.length > 0 && (
          <div className="mt-4">
            <PostImageDisplay images={postContent.images} />
          </div>
        )}
        <div className="mt-3">
          <PostInteraction
            initialRepliesAmount={post.postMetrics?.repliesCount ?? 0}
            initialLikesAmount={post.postMetrics?.likesCount ?? 0}
            initialRetweetsAmount={post.postMetrics?.retweetsCount ?? 0}
            postId={postInteractivityId}
            initialLike={currentLike}
            initialRetweet={currentRetweet}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDisplay;
