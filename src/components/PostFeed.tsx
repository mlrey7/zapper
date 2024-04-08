import React from "react";
import PostDisplayServer from "./postDisplay/PostDisplayServer";
import { getPostsFeed } from "@/controllers/postController";

const PostFeed = async () => {
  const posts = await getPostsFeed();

  return (
    <div className="flex w-full flex-col">
      {...posts.map((post) => {
        return <PostDisplayServer key={post.id} post={post} />;
      })}
    </div>
  );
};

export default PostFeed;
