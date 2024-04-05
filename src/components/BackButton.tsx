"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer rounded-full bg-black p-2"
      onClick={() => {
        router.back();
      }}
    >
      <X className="rounded=full h-6 w-6 bg-black text-white" />
    </div>
  );
};

export default BackButton;
