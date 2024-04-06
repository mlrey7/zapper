import BackButton from "@/components/BackButton";
import PostComments from "@/components/PostComments";
import PostDetailServer from "@/components/PostDetailServer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { cn, formatCompactNumber } from "@/lib/utils";
import { PostContentValidator } from "@/lib/validators/post";
import { PostAndAuthorAll } from "@/types/db";
import {
  BarChart,
  Heart,
  LoaderCircle,
  MessageCircle,
  Repeat,
} from "lucide-react";
import Image from "next/image";
import React, { Suspense } from "react";

const Page = async ({
  params: { postId, index },
}: {
  params: { postId: string; index: string };
}) => {
  let post: PostAndAuthorAll | null = null;
  const cachedPostWithoutMetrics = (await redis.hgetall(
    `post:${postId}`,
  )) as PostAndAuthorAll | null;

  if (!cachedPostWithoutMetrics) {
    post = await db.post.findFirst({
      where: {
        id: postId,
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
      },
    });
  } else {
    const postMetrics = await db.postMetrics.findFirst({
      where: {
        postId: postId,
      },
    });

    post = {
      ...cachedPostWithoutMetrics,
      postMetrics,
    };
  }

  const postContent = PostContentValidator.safeParse(post?.content);

  if (!postContent.success) return null;
  if (!postContent.data.images.length) return null;

  const imageLink = postContent.data.images[Number(index) - 1];

  return (
    <Dialog open={true}>
      <DialogContent className="left-0 right-0 h-full w-full max-w-full translate-x-0  bg-transparent p-0">
        <div className="absolute left-3 top-3">
          <BackButton />
        </div>
        <div
          className={cn(
            { "fixed inset-0 z-50 flex bg-black/90": false },
            { flex: true },
          )}
        >
          <div
            className={cn(
              "container flex h-screen flex-col items-center",
              "px-0",
            )}
          >
            <div className="flex-1 w-full min-h-0">
              <Image
                alt={`Image ${index}`}
                src={imageLink}
                width={0}
                height={0}
                className={cn("h-full w-full object-contain")}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw"
                priority={true}
              />
            </div>

            <div className="mx-auto flex w-full max-w-[600px] items-center justify-between p-4">
              <div className="flex">
                <MessageCircle className="mr-1 h-4 w-4 text-white" />
                <p className="text-xs text-white">
                  {formatCompactNumber(post?.postMetrics?.repliesCount ?? 0)}
                </p>
              </div>

              <div className="flex">
                <Repeat className={"mr-1 h-4 w-4 text-white"} />
                <p className="text-xs text-white">
                  {formatCompactNumber(post?.postMetrics?.retweetsCount ?? 0)}
                </p>
              </div>

              <div className="flex">
                <Heart className={"mr-1 h-4 w-4 text-white"} />
                <p className="text-xs text-white">
                  {formatCompactNumber(post?.postMetrics?.likesCount ?? 0)}
                </p>
              </div>

              <div className="flex">
                <BarChart className="mr-1 h-4 w-4 text-white" />
                <p className="text-xs text-white">
                  {formatCompactNumber(post?.postMetrics?.likesCount ?? 0)}
                </p>
              </div>
            </div>
          </div>
          <aside className="hidden w-[350px] flex-shrink-0 bg-background md:max-w-[420px] lg:block">
            <PostDetailServer
              post={post!}
              connected={false}
              showImages={false}
            />
            <Suspense
              fallback={
                <div className="flex w-full items-center justify-center pt-16">
                  <LoaderCircle className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              }
            >
              <PostComments replyToId={post!.id} />
            </Suspense>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Page;
