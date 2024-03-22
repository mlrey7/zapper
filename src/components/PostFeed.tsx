import { ExtendedPost } from "@/types/db";
import React from "react";
import PostDisplay from "./PostDisplay";

interface PostFeedProps {
  initialPosts: Array<ExtendedPost>;
}

const PostFeed = ({ initialPosts }: PostFeedProps) => {
  const posts = initialPosts;

  return (
    <div className="flex w-full flex-col">
      {...posts.map((post) => <PostDisplay key={post.id} post={post} />)}
    </div>
  );
};

export default PostFeed;
