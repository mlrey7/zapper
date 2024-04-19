import { Loader2 } from "lucide-react";
import React from "react";

const FeedLoading = () => {
  return (
    <li className="mx-auto py-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </li>
  );
};

export default FeedLoading;
