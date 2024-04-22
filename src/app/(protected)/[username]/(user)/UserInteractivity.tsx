"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { UserFollowRequest } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { useHover } from "@mantine/hooks";
import { cn } from "@/lib/utils";

const UserInteractivity = ({
  isCurrentUser,
  followingId,
  isFollowing,
}: {
  isCurrentUser: boolean;
  followingId: string;
  isFollowing: boolean;
}) => {
  const router = useRouter();
  const { hovered, ref } = useHover<HTMLButtonElement>();

  const { mutate: follow } = useMutation({
    mutationFn: async () => {
      const payload: UserFollowRequest = {
        followingId,
      };

      return await fetch("/api/user/follow", {
        body: JSON.stringify(payload),
        method: "POST",
      });
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Could not follow user please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const { mutate: unfollow } = useMutation({
    mutationFn: async () => {
      const payload: UserFollowRequest = {
        followingId,
      };

      return await fetch("/api/user/unfollow", {
        body: JSON.stringify(payload),
        method: "POST",
      });
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Could not follow user please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return isCurrentUser ? (
    <Button
      variant={"outline"}
      onClick={() => {
        router.push("/settings/profile");
      }}
    >
      Edit profile
    </Button>
  ) : isFollowing ? (
    <Button
      variant={"outline"}
      onClick={() => unfollow()}
      ref={ref}
      className={cn(
        "w-28 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500",
      )}
    >
      {hovered ? "Unfollow" : "Following"}
    </Button>
  ) : (
    <Button onClick={() => follow()}>Follow</Button>
  );
};

export default UserInteractivity;
