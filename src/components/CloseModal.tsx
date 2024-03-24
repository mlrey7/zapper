"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const CloseModal = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <Button
        aria-label="close modal"
        variant={"ghost"}
        className="h-6 w-6 rounded-md p-0"
        onClick={() => router.back()}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        className="rounded-md font-medium text-blue-500"
        variant={"ghost"}
      >
        Drafts
      </Button>
    </div>
  );
};

export default CloseModal;
