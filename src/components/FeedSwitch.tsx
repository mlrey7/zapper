"use client";

import { Settings } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useFeedStatus } from "./FeedStatusProvider";

const FeedSwitch = () => {
  const { feedStatus, setFeedStatus } = useFeedStatus()();

  return (
    <div className="flex h-full w-full items-center border-b">
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => setFeedStatus("all")}
      >
        {feedStatus === "all" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">All posts</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>All posts</div>
        )}
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => setFeedStatus("following")}
      >
        {feedStatus === "following" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">Following</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>Following</div>
        )}
      </div>
      <Button variant={"ghost"} size={"icon"}>
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FeedSwitch;
