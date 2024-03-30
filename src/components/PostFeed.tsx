import { PostAndAuthor } from "@/types/db";
import React from "react";
import PostDisplayServer from "./PostDisplayServer";

interface PostFeedProps {
  initialPosts: Array<PostAndAuthor>;
}

const PostFeed = ({ initialPosts }: PostFeedProps) => {
  const posts = initialPosts;

  return (
    <div className="flex w-full flex-col">
      {...posts.map((post) => <PostDisplayServer key={post.id} post={post} />)}
    </div>
  );
};

export default PostFeed;
