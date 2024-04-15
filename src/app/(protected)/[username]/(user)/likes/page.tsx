import PostDisplayServer from "@/components/postDisplay/PostDisplayServer";
import { getUserLikedPosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";
import React from "react";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  if (!user) return null;

  const posts = (await getUserLikedPosts(user.id)).map((like) => {
    return {
      ...like.post,
    };
  });

  return (
    <>
      {...posts.map((post) => {
        return <PostDisplayServer key={post.id} post={post} />;
      })}
    </>
  );
};

export default Page;
