import ModalCreatePost from "@/components/ModalCreatePost";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams?: { replyTo: string };
}) => {
  const session = await getAuthSession();
  if (!session) return null;

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

  return (
    <div className="fixed inset-0 z-20 bg-zinc-600/30">
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
  );
};

export default Page;
