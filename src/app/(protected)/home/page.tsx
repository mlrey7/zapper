import MiniCreatePost from "@/components/MiniCreatePost";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import PostFeed from "@/components/PostFeed";
import { LoaderCircle } from "lucide-react";

const Page = async () => {
  const session = await getAuthSession();

  if (!session) redirect("/");

  return (
    <div className="mt-16 flex min-h-screen flex-col items-center">
      <MiniCreatePost
        user={{
          name: session?.user.name ?? "",
          image: session?.user.image ?? "",
        }}
      />
      <Suspense
        fallback={
          <div className="flex w-full items-center justify-center px-4 py-3">
            <LoaderCircle className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        }
      >
        <PostFeed />
      </Suspense>
    </div>
  );
};

export default Page;
