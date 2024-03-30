import PostDetail from "@/components/PostDetail";
import PostDisplay from "@/components/PostDisplay";
import ReplyDisplay from "@/components/ReplyDisplay";
import ReplyDisplayServer from "@/components/ReplyDisplayServer";
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
      replies: {
        include: {
          author: true,
          postMetrics: true,
        },
      },
      retweets: true,
      postMetrics: true,
    },
  });

  if (!post) return null;

  return (
    <div className="mt-16 min-h-screen">
      <PostDetail post={post} />
      {post.replies.map((reply) => (
        <ReplyDisplayServer key={reply.id} post={reply} />
      ))}
    </div>
  );
};

export default Page;
