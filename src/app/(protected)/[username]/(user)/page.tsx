import PostDisplayServer from "@/components/postDisplay/PostDisplayServer";
import { getUser } from "@/controllers/userController";

const Page = async ({
  params: { username },
}: {
  params: { username: string };
}) => {
  const user = await getUser(username);

  if (!user) return null;

  return (
    <>
      {...user.posts.map((post) => {
        return <PostDisplayServer key={post.id} post={post} />;
      })}
    </>
  );
};

export default Page;
