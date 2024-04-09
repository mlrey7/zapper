"use client";

import { buttonVariants } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSelectedLayoutSegment } from "next/navigation";

type UserPostsFeedType = "posts" | "replies" | "media" | "likes";

const segmentToUserPostsFeedType = (segment: string | null) => {
  if (segment === "") {
    return "posts";
  } else if (segment === "with_replies") {
    return "replies";
  } else if (segment === "media") {
    return segment;
  } else if (segment === "likes") {
    return segment;
  } else {
    return "posts";
  }
};

const UserPostsSwitch = ({ username }: { username: string }) => {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const [userPostsFeed, setUserPostsFeed] = useState<UserPostsFeedType>(
    segmentToUserPostsFeedType(segment),
  );

  const handleSwitch = (feedType: UserPostsFeedType) => {
    if (feedType === "posts") router.replace(`/${username}`);
    else if (feedType === "replies")
      router.replace(`/${username}/with_replies`);
    else if (feedType === "media") router.replace(`/${username}/media`);
    else if (feedType === "likes") router.replace(`/${username}/likes`);

    setUserPostsFeed(feedType);
  };

  return (
    <div className="flex h-14 w-full items-center border-b">
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => handleSwitch("posts")}
      >
        {userPostsFeed === "posts" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">Posts</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>Posts</div>
        )}
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => handleSwitch("replies")}
      >
        {userPostsFeed === "replies" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">Replies</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>Replies</div>
        )}
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => handleSwitch("media")}
      >
        {userPostsFeed === "media" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">Media</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>Media</div>
        )}
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-full flex-1 cursor-pointer rounded-none py-0",
        )}
        onClick={() => handleSwitch("likes")}
      >
        {userPostsFeed === "likes" ? (
          <div className="flex h-full flex-col justify-between">
            <div />
            <p className="mt-1">Likes</p>
            <div className="h-1 w-full rounded bg-blue-500" />
          </div>
        ) : (
          <div>Likes</div>
        )}
      </div>
    </div>
  );
};

export default UserPostsSwitch;
