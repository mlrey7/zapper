import { getAuthSession } from "@/lib/auth";
import { PostContentType, PostContentValidator } from "@/lib/validators/post";
import { ExtendedPost, PostAndAuthor, PostAndAuthorAll } from "@/types/db";
import React from "react";
import PostDisplayMoreOptions from "./PostDisplayMoreOptions";
import PostImageDisplay from "./PostImageDisplay";
import PostInteraction from "./PostInteraction";
import UserAvatar from "./UserAvatar";
import { format } from "date-fns";
import CreateComment from "./CreateComment";
import { User } from "@prisma/client";
import EmbeddedPost from "./EmbeddedPost";

interface PostDetailClientProps {
  post: PostAndAuthorAll;
  currentLike: boolean;
  currentRetweet: boolean;
  postContent: PostContentType;
  user: Pick<User, "name" | "username" | "image">;
}

const PostDetailClient = ({
  post,
  currentLike,
  currentRetweet,
  postContent,
  user,
}: PostDetailClientProps) => {
  return (
    <div className="border-b px-4 py-3">
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
          {postContent.text}
        </p>

        <PostImageDisplay images={postContent.images} />

        {!!post.quoteTo && <EmbeddedPost embeddedPost={post.quoteTo} />}

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
            initialRepliesAmount={post.postMetrics?.repliesCount ?? 0}
            initialLikesAmount={post.postMetrics?.likesCount ?? 0}
            initialRetweetsAmount={post.postMetrics?.retweetsCount ?? 0}
            postId={post.id}
            initialLike={currentLike}
            initialRetweet={currentRetweet}
          />
        </div>
        <CreateComment
          user={{
            name: user.name ?? "",
            image: user.image ?? "",
          }}
          replyToPost={post}
        />
      </div>
    </div>
  );
};

export default PostDetailClient;
