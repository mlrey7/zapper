import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="mx-auto mt-12 px-4">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
