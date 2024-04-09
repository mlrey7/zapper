"use client";

import { cn, formatTimeToNow } from "@/lib/utils";
import PostImageDisplay from "./PostImageDisplay";
import UserAvatar from "./UserAvatar";
import { PostAndAuthor } from "@/types/db";
import { PostContentValidator } from "@/lib/validators/post";
import { useRouter } from "next/navigation";

interface EmbeddedPostProps {
  embeddedPost: PostAndAuthor;
  className?: string;
}

const EmbeddedPost = ({ embeddedPost, className }: EmbeddedPostProps) => {
  const router = useRouter();
  const embeddedPostContent = PostContentValidator.safeParse(
    embeddedPost.content,
  );

  if (!embeddedPostContent.success) return null;

  return (
    <div
      className={cn("cursor-pointer rounded-3xl border", className)}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(
          `/${embeddedPost.author.username}/status/${embeddedPost.id}`,
        );
      }}
    >
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center gap-1">
          <UserAvatar user={embeddedPost.author} className="h-6 w-6" />
          <h6 className="text-sm font-bold">{embeddedPost.author.name}</h6>
          <p className="text-sm text-gray-600">
            @{embeddedPost.author.username}
          </p>
          <span className="text-sm text-gray-600">•</span>
          <p className="text-sm text-gray-600">
            {formatTimeToNow(new Date(embeddedPost.createdAt))}
          </p>
        </div>
        <p className="max-h-[500px] text-ellipsis text-wrap break-words text-sm">
          {embeddedPostContent.data.text}
        </p>
      </div>
      <PostImageDisplay
        images={embeddedPostContent.data.images}
        postId={embeddedPost.id}
        username={embeddedPost.author.username}
        isEmbedded
      />
    </div>
  );
};

export default EmbeddedPost;
