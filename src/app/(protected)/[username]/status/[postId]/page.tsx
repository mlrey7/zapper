import PostComments from "@/components/PostComments";
import PostDetailServer from "@/components/PostDetailServer";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostAndAuthor } from "@/types/db";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

function omit<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[],
): Omit<Data, Keys> {
  const result = { ...data };

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<Data, Keys>;
}

const Page = async ({ params }: { params: { postId: string } }) => {
  let post: PostAndAuthor | null;

  const cachedPostWithoutMetrics = (await redis.hgetall(
    `post:${params.postId}`,
  )) as Omit<PostAndAuthor, "postMetrics"> | null;

  if (!cachedPostWithoutMetrics) {
    post = await db.post.findFirst({
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

    if (post) {
      await redis.hset(`post:${params.postId}`, omit(post, ["postMetrics"]));
    }
  } else {
    const postMetrics = await db.postMetrics.findFirst({
      where: {
        postId: params.postId,
      },
    });

    post = {
      ...cachedPostWithoutMetrics!,
      postMetrics,
    };
  }

  return (
    <div className="mt-16 min-h-screen">
      <PostDetailServer post={post!} />
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
