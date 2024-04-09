"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const HeaderMainClient = () => {
  const router = useRouter();

  return (
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
  );
};

export default HeaderMainClient;
