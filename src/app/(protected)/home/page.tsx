import MiniCreatePost from "@/components/MiniCreatePost";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getAuthSession();

  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <MiniCreatePost
        user={{
          name: session?.user.name ?? "",
          image: session?.user.image ?? "",
        }}
      />
    </div>
  );
};

export default Page;
