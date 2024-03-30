import PostComments from "@/components/PostComments";
import PostDetailServer from "@/components/PostDetailServer";
import { db } from "@/lib/db";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

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
      postMetrics: true,
    },
  });

  if (!post) return null;

  return (
    <div className="mt-16 min-h-screen">
      <PostDetailServer post={post} />
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center pt-16">
            <LoaderCircle className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        }
      >
        <PostComments replyToId={post.id} />
      </Suspense>
    </div>
  );
};

export default Page;
