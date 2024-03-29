import { getAuthSession } from "@/lib/auth";
import { formatTimeToNow } from "@/lib/utils";
import { PostContentValidator } from "@/lib/validators/post";
import { ExtendedPost } from "@/types/db";
import React from "react";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import UserAvatar from "./UserAvatar";
import { format } from "date-fns";

interface PostDetailProps {
  post: ExtendedPost;
}

const PostDetail = async ({ post }: PostDetailProps) => {
  const session = await getAuthSession();

  const postContent = PostContentValidator.safeParse(post.content);
  const currentLike = !!post.likes.find(
    (like) => like.userId === session?.user.id,
  );

  return (
    <div className="px-4 py-3">
      <div className="flex w-full flex-col gap-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <UserAvatar user={post.author} />
          <div className="flex flex-col">
            <h6 className="text-sm font-bold">{post.author.name}</h6>
            <p className="text-sm text-gray-600">@{post.author.username}</p>
          </div>
          <div className="flex-1" />
          <PostDisplayMoreOptions />
        </div>
        <p className="w-full text-wrap break-words text-sm">
          {postContent.success ? postContent.data.text : "Error"}
        </p>
        <PostImageDisplay
          images={postContent.success ? postContent.data.images : []}
        />
        <div className="flex gap-1 border-b pb-3">
          <p className="text-sm text-gray-600">
            {format(new Date(post.createdAt), "hh:mm a")}
          </p>
          <span className="text-sm text-gray-600">•</span>
          <p className="text-sm text-gray-600">
            {format(new Date(post.createdAt), "MMM d, y")}
          </p>
        </div>

        <div className="-mt-3 border-b py-1">
          <PostInteraction
            initialRepliesAmount={post.replies.length}
            initialLikesAmount={post.likes.length}
            initialRetweetsAmount={post.retweets.length}
            postId={post.id}
            initialLike={currentLike}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
