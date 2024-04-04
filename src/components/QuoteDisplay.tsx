"use client";

import { ExtendedPost, PostAndAuthor, PostAndAuthorAll } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { cn, formatTimeToNow } from "@/lib/utils";
import { PostContentType, PostContentValidator } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmbeddedPost from "./EmbeddedPost";

interface QuoteDisplayProps {
  post: PostAndAuthorAll;
  currentLike: boolean;
  currentRetweet: boolean;
  postContent: PostContentType;
  className?: string;
  connected?: boolean;
}

const QuoteDisplay = ({
  post,
  currentLike,
  currentRetweet,
  postContent,
  className,
  connected,
}: QuoteDisplayProps) => {
  const router = useRouter();

  const quotedPost = post.quoteTo!;

  const quotedPostContent = PostContentValidator.safeParse(quotedPost.content);

  if (!quotedPostContent.success) return null;

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-3 border-b px-4 py-3",
        {
          "pb-0": connected,
        },
        className,
      )}
      onClick={() => {
        router.push(`/${post.author.username}/status/${post.id}`);
      }}
    >
      <div className="flex flex-col items-center self-stretch">
        <UserAvatar
          user={post.author}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            router.push(`/${post.author.username}`);
          }}
        />
        {connected && <div className="mt-1 w-[2px] flex-1 bg-gray-600" />}
      </div>

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
        <EmbeddedPost className="mt-4" embeddedPost={quotedPost} />
        <div className="mt-3">
          <PostInteraction
            initialRepliesAmount={post.postMetrics?.repliesCount ?? 0}
            initialLikesAmount={post.postMetrics?.likesCount ?? 0}
            initialRetweetsAmount={post.postMetrics?.retweetsCount ?? 0}
            postId={post.id}
            initialLike={currentLike}
            initialRetweet={currentRetweet}
          />
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
