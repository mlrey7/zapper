"use client";

import React from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

const PostDisplayMoreOptions = () => {
  return (
    <Ellipsis
      className={cn(
        "h-4 w-4 cursor-pointer rounded-md text-gray-600 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      )}
    />
  );
};

export default PostDisplayMoreOptions;
