import { Loader2 } from "lucide-react";
import React from "react";

const FeedLoading = () => {
  return (
    <li className="mx-auto py-3">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </li>
  );
};

export default FeedLoading;
