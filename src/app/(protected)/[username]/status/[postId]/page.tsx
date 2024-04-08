import PostComments from "@/components/PostComments";
import PostDetailServer from "@/components/PostDetailServer";
import PostDisplayServer from "@/components/postDisplay/PostDisplayServer";
import { getPostWithQuoteAndReply } from "@/controllers/postController";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

const Page = async ({ params: { postId } }: { params: { postId: string } }) => {
  let post = await getPostWithQuoteAndReply(postId);

  return (
    <div className="mt-16 min-h-screen">
      {post?.replyTo && (
        <PostDisplayServer
          post={post.replyTo}
          className="border-none"
          connected
        />
      )}
      <PostDetailServer post={post!} connected={!!post!.replyTo} />
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center pt-16">
            <LoaderCircle className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        }
      >
        <PostComments replyToId={post!.id} />
      </Suspense>
    </div>
  );
};

export default Page;
