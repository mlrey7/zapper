"use client";

import { PostAndAuthorAll } from "@/types/db";
import React from "react";
import UserAvatar from "../UserAvatar";
import { cn, formatTimeToNow } from "@/lib/utils";
import { PostContentValidator } from "@/lib/validators/post";
import PostImageDisplay from "../PostImageDisplay";
import PostInteraction from "../PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { useRouter } from "next/navigation";
import EmbeddedPost from "../EmbeddedPost";
import { Repeat } from "lucide-react";

interface PostDisplayClientProps {
  post: PostAndAuthorAll;
  className?: string;
  connected?: boolean;
}

const PostDisplayClient = ({
  post,
  className,
  connected,
}: PostDisplayClientProps) => {
  const router = useRouter();

  const quotedPost = post.quoteTo;

  const postContent = PostContentValidator.parse(post?.content);

  const isRetweetPost =
    !!quotedPost && postContent.text === "" && postContent.images.length === 0;
  const isQuotePost =
    !!quotedPost && (postContent.text !== "" || postContent.images.length > 0);

  const activePost = isRetweetPost ? quotedPost : post;

  let activePostContent: { text: string; images: string[] } | null = null;

  const parsedQuotePostContent = PostContentValidator.safeParse(
    quotedPost?.content,
  );

  if (isRetweetPost && !parsedQuotePostContent.success) {
    return null;
  }

  if (isRetweetPost && parsedQuotePostContent.success) {
    activePostContent = parsedQuotePostContent.data;
  } else {
    activePostContent = postContent;
  }

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
        router.push(`/${activePost.author.username}/status/${activePost.id}`);
      }}
    >
      {isRetweetPost && (
        <div className="-mt-1 flex items-center gap-3 ">
          <div className="flex w-10 justify-end">
            <Repeat className="h-3 w-3 text-gray-600" />
          </div>
          <p className="text-xs font-semibold text-gray-600">
            {post.author.name} {" reposted"}
          </p>
        </div>
      )}

      <div className="flex items-start gap-3 ">
        <div className="flex flex-col items-center self-stretch">
          <UserAvatar
            user={activePost.author}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/${activePost.author.username}`);
            }}
          />
          {connected && <div className="mt-1 w-[2px] flex-1 bg-gray-600" />}
        </div>

        <div className="flex w-full flex-col overflow-hidden">
          <div className="flex items-center gap-1">
            <h6 className="text-sm font-bold">{activePost.author.name}</h6>
            <p className="text-sm text-gray-600">
              @{activePost.author.username}
            </p>
            <span className="text-sm text-gray-600">•</span>
            <p className="text-sm text-gray-600">
              {formatTimeToNow(new Date(activePost.createdAt))}
            </p>
            <div className="flex-1" />
            <PostDisplayMoreOptions />
          </div>
          <p className="w-full text-wrap break-words text-sm">
            {activePostContent.text}
          </p>
          {activePostContent.images.length > 0 && (
            <div className="mt-4">
              <PostImageDisplay
                images={activePostContent.images}
                postId={activePost.id}
                username={activePost.author.username}
              />
            </div>
          )}
          {isQuotePost && (
            <EmbeddedPost className="mt-4" embeddedPost={quotedPost} />
          )}
          <div className="mt-3">
            <PostInteraction postId={activePost.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDisplayClient;
