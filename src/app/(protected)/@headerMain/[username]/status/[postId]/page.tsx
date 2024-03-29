"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex h-full items-center px-4 py-3">
      <Button
        variant={"ghost"}
        size={"icon"}
        className="-ml-1"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h2 className="ml-6 text-xl font-bold">Post</h2>
    </div>
  );
};

export default Page;
