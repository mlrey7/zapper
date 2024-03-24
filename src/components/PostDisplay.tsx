import { ExtendedPost } from "@/types/db";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { PostContentValidator, PostValidator } from "@/lib/validators/post";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import { getAuthSession } from "@/lib/auth";

interface PostDisplayProps {
  post: ExtendedPost;
}

const PostDisplay = async ({ post }: PostDisplayProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.content);
  const currentLike = !!post.likes.find(
    (like) => like.userId === session?.user.id,
  );

  return (
    <div className="flex items-start gap-3 border-b px-4 py-3">
      <UserAvatar user={post.author} />
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
          {postContent.success ? postContent.data.text : "Error"}
        </p>
        <PostImageDisplay
          images={postContent.success ? postContent.data.images : []}
        />
        <PostInteraction
          initialRepliesAmount={post.replies.length}
          initialLikesAmount={post.likes.length}
          initialRetweetsAmount={post.retweets.length}
          postId={post.id}
          initialLike={currentLike}
        />
      </div>
    </div>
  );
};

export default PostDisplay;
