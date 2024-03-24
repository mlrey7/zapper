import CloseModal from "@/components/CloseModal";
import ModalCreatePost from "@/components/ModalCreatePost";
import { getAuthSession } from "@/lib/auth";
import React from "react";

const Page = async () => {
  const session = await getAuthSession();
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-10 bg-zinc-600/30">
      <div className="container mx-auto flex h-full w-full pt-12">
        <ModalCreatePost
          user={{
            name: session?.user.name ?? "",
            image: session?.user.image ?? "",
          }}
        />
      </div>
    </div>
  );
};

export default Page;
