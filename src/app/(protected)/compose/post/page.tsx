import MiniCreatePost from "@/components/MiniCreatePost";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import PostFeed from "@/components/PostFeed";
import ModalCreatePost from "@/components/ModalCreatePost";

const Page = async ({
  searchParams,
}: {
  searchParams?: { replyTo: string };
}) => {
  const session = await getAuthSession();

  if (!session) redirect("/");

  const replyToPost = searchParams?.replyTo
    ? await db.post.findFirst({
        where: {
          id: searchParams?.replyTo,
        },
        include: {
          author: true,
        },
      })
    : null;

  const posts = await db.post.findMany({
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
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

  // const posts = await db.user.findUnique({
  //   where: {
  //     id: session.user.id
  //   },
  //   include: {
  //     following: {
  //       include: {
  //         following: {
  //           include: {
  //             posts: true
  //           }
  //         }
  //       }
  //     },
  //     posts: true
  //   },
  // })

  return (
    <>
      <div className="fixed inset-0 z-10 bg-zinc-600/30">
        <div className="container mx-auto flex h-full w-full pt-12">
          <ModalCreatePost
            user={{
              name: session?.user.name ?? "",
              image: session?.user.image ?? "",
            }}
            replyToPost={replyToPost}
          />
        </div>
      </div>

      <div className="mt-16 flex min-h-screen flex-col items-center">
        <MiniCreatePost
          user={{
            name: session?.user.name ?? "",
            image: session?.user.image ?? "",
          }}
        />
        <PostFeed initialPosts={posts} />
      </div>
    </>
  );
};

export default Page;
