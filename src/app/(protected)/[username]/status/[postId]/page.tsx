import PostDetail from "@/components/PostDetail";
import { db } from "@/lib/db";

const Page = async ({ params }: { params: { postId: string } }) => {
  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
          username: true,
        },
      },
      likes: true,
      replies: true,
      retweets: true,
    },
  });

  if (!post) return null;

  return (
    <div className="mt-16">
      <PostDetail post={post} />
    </div>
  );
};

export default Page;
