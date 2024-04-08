import MiniCreatePost from "@/components/MiniCreatePost";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import PostFeed from "@/components/PostFeed";
import ModalCreatePost from "@/components/ModalCreatePost";
import { getPost } from "@/controllers/postController";

const Page = async ({
  searchParams,
}: {
  searchParams?: { replyTo: string; quoteTo: string };
}) => {
  const session = await getAuthSession();

  if (!session) redirect("/");

  const replyToPost = searchParams?.replyTo
    ? await getPost(searchParams.replyTo)
    : null;

  const quotedPost = searchParams?.quoteTo
    ? await getPost(searchParams.quoteTo)
    : null;

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
            quotedPost={quotedPost}
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
        <PostFeed />
      </div>
    </>
  );
};

export default Page;
