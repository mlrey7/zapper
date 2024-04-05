import PostComments from "@/components/PostComments";
import PostDetailServer from "@/components/PostDetailServer";
import PostDisplayServer from "@/components/postDisplay/PostDisplayServer";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { omit } from "@/lib/utils";
import {
  PostAndAuthor,
  PostAndAuthorAll,
  PostAndAuthorAllWithReply,
} from "@/types/db";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

const Page = async ({ params }: { params: { postId: string } }) => {
  let post: PostAndAuthorAllWithReply | null;

  const cachedPostWithoutMetrics = (await redis.hgetall(
    `post:${params.postId}`,
  )) as Omit<PostAndAuthorAllWithReply, "postMetrics"> | null;

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
        quoteTo: {
          include: {
            author: true,
            postMetrics: true,
          },
        },
        replyTo: {
          include: {
            author: true,
            postMetrics: true,
            quoteTo: {
              include: {
                author: true,
                postMetrics: true,
              },
            },
          },
        },
      },
    });

    if (post) {
      let strippedReply: PostAndAuthorAll | null = null;
      let strippedQuote: PostAndAuthor | null = null;

      if (post.replyTo) {
        let strippedReplyQuote: PostAndAuthor | null = null;
        if (post.replyTo.quoteTo) {
          strippedReplyQuote = omit(post.replyTo.quoteTo, ["postMetrics"]);
        }

        strippedReply = omit(post.replyTo, ["postMetrics"]);
        strippedReply = {
          ...strippedReply,
          quoteTo: strippedReplyQuote,
        };
      }

      if (post.quoteTo) {
        strippedQuote = omit(post.quoteTo, ["postMetrics"]);
      }

      const strippedPost = {
        ...post,
        quoteTo: strippedQuote,
        replyTo: strippedReply,
      };

      await redis.hset(
        `post:${params.postId}`,
        omit(strippedPost, ["postMetrics"]),
      );

      await redis.expire(`post:${params.postId}`, 3600);
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
