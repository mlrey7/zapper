import { Loader2 } from "lucide-react";
import React from "react";

const LoadingImage = ({ width, height }: { width: number; height: number }) => {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-3xl bg-gray-600`}
      style={{
        aspectRatio: width / height,
      }}
    >
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default LoadingImage;
