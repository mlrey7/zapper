import { ExtendedPost } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { PostContentValidator, PostValidator } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";

interface PostDisplayProps {
  post: ExtendedPost;
}

const PostDisplay = ({ post }: PostDisplayProps) => {
  const postContent = PostContentValidator.safeParse(post.content);

  return (
    <div className="flex items-start gap-3 border-b p-4">
      <UserAvatar user={post.author} />
      <div className="flex w-full flex-col overflow-hidden">
        <div className="flex items-center gap-1">
          <h6 className="text-sm font-bold">{post.author.name}</h6>
          <p className="text-sm text-gray-600">@{post.author.username}</p>
          <span className="text-sm text-gray-600">•</span>
          <p className="text-sm text-gray-600">
            {formatTimeToNow(new Date(post.createdAt))}
          </p>
        </div>
        <p className="w-full text-wrap break-words text-sm">
          {postContent.success ? postContent.data.text : "Error"}
        </p>
        <PostImageDisplay
          images={postContent.success ? postContent.data.images : []}
        />
      </div>
    </div>
  );
};

export default PostDisplay;
