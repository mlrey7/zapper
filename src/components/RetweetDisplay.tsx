"use client";

import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { cn, formatTimeToNow } from "@/lib/utils";
import { PostContentType, PostContentValidator } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { useRouter } from "next/navigation";
import { Repeat } from "lucide-react";

interface RetweetDisplayProps {
  post: PostAndAuthorAll;
  currentLike: boolean;
  currentRetweet: boolean;
  postContent: PostContentType;
  className?: string;
  connected?: boolean;
}

const RetweetDisplay = ({
  post,
  currentLike,
  currentRetweet,
  postContent,
  className,
  connected,
}: RetweetDisplayProps) => {
  const router = useRouter();

  const quotedPost = post.quoteTo!;
  const quotedPostContent = PostContentValidator.safeParse(quotedPost.content);

  if (!quotedPostContent.success) return null;

  const initialRepliesAmount = quotedPost.postMetrics?.repliesCount ?? 0;
  const initialLikesAmount = quotedPost.postMetrics?.likesCount ?? 0;
  const initialRetweetsAmount = quotedPost.postMetrics?.retweetsCount ?? 0;

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col gap-1 border-b px-4 py-3",
        {
          "pb-0": connected,
        },
        className,
      )}
      onClick={() => {
        router.push(`/${quotedPost.author.username}/status/${quotedPost.id}`);
      }}
    >
      <div className="-mt-1 flex items-center gap-3 ">
        <div className="flex w-10 justify-end">
          <Repeat className="h-3 w-3 text-gray-600" />
        </div>
        <p className="text-xs font-semibold text-gray-600">
          {post.author.name} {" reposted"}
        </p>
      </div>

      <div className="flex items-start gap-3 ">
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
            <h6 className="text-sm font-bold">{quotedPost.author.name}</h6>
            <p className="text-sm text-gray-600">
              @{quotedPost.author.username}
            </p>
            <span className="text-sm text-gray-600">•</span>
            <p className="text-sm text-gray-600">
              {formatTimeToNow(new Date(quotedPost.createdAt))}
            </p>
            <div className="flex-1" />
            <PostDisplayMoreOptions />
          </div>
          <p className="w-full text-wrap break-words text-sm">
            {quotedPostContent.data.text}
          </p>
          {quotedPostContent.data.images.length > 0 && (
            <div className="mt-4">
              <PostImageDisplay images={quotedPostContent.data.images} />
            </div>
          )}
          <div className="mt-3">
            <PostInteraction
              initialRepliesAmount={initialRepliesAmount}
              initialLikesAmount={initialLikesAmount}
              initialRetweetsAmount={initialRetweetsAmount}
              postId={post.quoteToId!}
              initialLike={currentLike}
              initialRetweet={currentRetweet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetweetDisplay;
