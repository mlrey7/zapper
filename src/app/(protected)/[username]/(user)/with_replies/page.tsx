import PostDisplayServer from "@/components/postDisplay/PostDisplayServer";
import { getUserPosts } from "@/controllers/postController";
import { getUser } from "@/controllers/userController";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);
  if (!user) return null;

  const posts = (await getUserPosts(user.id)).map((post) => {
    return {
      ...post,
      author: {
        image: user.image,
        name: user.name,
        username: user.username,
      },
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
