"use client";

import { ExtendedPost, PostAndAuthor, PostAndAuthorAll } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { PostContentType } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Repeat } from "lucide-react";

interface RetweetDisplayProps {
  post: PostAndAuthorAll;
  currentLike: boolean;
  currentRetweet: boolean;
  postContent: PostContentType;
}

const RetweetDisplay = ({
  post: parentPost,
  currentLike,
  currentRetweet,
  postContent,
}: RetweetDisplayProps) => {
  const router = useRouter();

  const post = parentPost.quoteTo!;

  const initialRepliesAmount = post.postMetrics?.repliesCount ?? 0;
  const initialLikesAmount = post.postMetrics?.likesCount ?? 0;
  const initialRetweetsAmount = post.postMetrics?.retweetsCount ?? 0;

  return (
    <div
      className="flex cursor-pointer flex-col gap-1 border-b px-4 py-3"
      onClick={() => {
        router.push(`/${post.author.username}/status/${post.id}`);
      }}
    >
      <div className="-mt-1 flex items-center gap-3 ">
        <div className="flex w-10 justify-end">
          <Repeat className="h-3 w-3 text-gray-600" />
        </div>
        <p className="text-xs font-semibold text-gray-600">
          {parentPost.author.name} {" reposted"}
        </p>
      </div>

      <div className="flex items-start gap-3 ">
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
