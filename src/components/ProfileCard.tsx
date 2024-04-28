"use client";

import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { UserMetrics } from "@prisma/client";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserFollowRequest } from "@/lib/validators/user";
import { useHover } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ComponentPropsWithoutRef } from "react";
import React from "react";
import { UserPublic } from "@/types/db";
import { Loader2 } from "lucide-react";

interface ProfileCardProps extends ComponentPropsWithoutRef<"div"> {
  userId: string;
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ className, userId, ...props }: ProfileCardProps, forwardRef) => {
    const router = useRouter();
    const { hovered, ref } = useHover<HTMLButtonElement>();
    const queryClient = useQueryClient();

    const { data: isFollowing, isPending: isFollowingPending } = useQuery({
      queryKey: ["users", userId, "is-following"],
      queryFn: async () => {
        const data = await fetch(`/api/user/${userId}/is-following`);
        const isFollow = await data.json();
        return !!isFollow;
      },
      placeholderData: false,
    });

    const { data: user, isPending: isUserPending } = useQuery({
      queryKey: ["users", userId, "profile"],
      queryFn: async () => {
        const data = await fetch(`/api/user/${userId}/profile`);
        const user = await data.json();
        return user as UserPublic;
      },
    });

    const { data: userMetrics, isPending: isUserMetricsPending } = useQuery({
      queryKey: ["users", userId, "user-metrics"],
      queryFn: async () => {
        const data = await fetch(`/api/user/${userId}/user-metrics`);
        const userMetrics = await data.json();
        return userMetrics as UserMetrics;
      },
    });

    const { mutate: follow } = useMutation({
      mutationFn: async () => {
        const payload: UserFollowRequest = {
          followingId: userId,
        };

        return await fetch("/api/user/follow", {
          body: JSON.stringify(payload),
          method: "POST",
        });
      },
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["users", userId, "is-following"],
        });
        queryClient.setQueryData(["users", userId, "is-following"], () => true);

        const previousUserMetrics = queryClient.getQueryData([
          "users",
          userId,
          "user-metrics",
        ]);

        queryClient.setQueryData(
          ["users", userId, "user-metrics"],
          (oldPostMetrics: UserMetrics) => {
            return {
              ...oldPostMetrics,
              followersCount: oldPostMetrics.followersCount + 1,
            };
          },
        );

        return { previousUserMetrics };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(["users", userId, "is-following"], false);
        queryClient.setQueryData(
          ["users", userId, "user-metrics"],
          context?.previousUserMetrics,
        );

        return toast({
          title: "Something went wrong",
          description: "Could not follow user please try again",
          variant: "destructive",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["users", userId, "is-following"],
        });
        queryClient.invalidateQueries({
          queryKey: ["users", userId, "user-metrics"],
        });
      },
    });

    const { mutate: unfollow } = useMutation({
      mutationFn: async () => {
        const payload: UserFollowRequest = {
          followingId: userId,
        };

        return await fetch("/api/user/unfollow", {
          body: JSON.stringify(payload),
          method: "POST",
        });
      },
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["users", userId, "is-following"],
        });
        queryClient.setQueryData(
          ["users", userId, "is-following"],
          () => false,
        );

        const previousUserMetrics = queryClient.getQueryData([
          "users",
          userId,
          "user-metrics",
        ]);

        queryClient.setQueryData(
          ["users", userId, "user-metrics"],
          (oldPostMetrics: UserMetrics) => {
            return {
              ...oldPostMetrics,
              followersCount: oldPostMetrics.followersCount - 1,
            };
          },
        );

        return { previousUserMetrics };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(["users", userId, "is-following"], true);
        queryClient.setQueryData(
          ["users", userId, "user-metrics"],
          context?.previousUserMetrics,
        );

        return toast({
          title: "Something went wrong",
          description: "Could not unfollow user please try again",
          variant: "destructive",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["users", userId, "is-following"],
        });
        queryClient.invalidateQueries({
          queryKey: ["users", userId, "user-metrics"],
        });
      },
    });

    return (
      <div className={cn(className)} {...props} ref={forwardRef}>
        {isUserPending || isUserMetricsPending || isFollowingPending ? (
          <div className="mx-auto py-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="flex flex-col p-2">
            <div className="mb-4 flex justify-between">
              <UserAvatar
                className="h-16 w-16"
                user={user!}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  router.push(`/${user!.username}`);
                }}
              />
              {isFollowing ? (
                <Button
                  variant={"outline"}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    unfollow();
                  }}
                  ref={ref}
                  className={cn(
                    "w-28 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500",
                  )}
                >
                  {hovered ? "Unfollow" : "Following"}
                </Button>
              ) : (
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    follow();
                  }}
                >
                  Follow
                </Button>
              )}
            </div>
            <h6
              className="font-bold hover:underline"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                router.push(`/${user!.username}`);
              }}
            >
              {user?.name}
            </h6>

            <div className="flex items-center">
              <p className="text-sm text-gray-600">@{user?.username}</p>
              {isFollowing && (
                <p className="ml-2 rounded bg-gray-800 px-1 text-xs font-semibold text-gray-500">
                  Follows you
                </p>
              )}
            </div>
            {user!.bio && <p className="mt-3">{user!.bio}</p>}
            <div className="mt-3 flex gap-6">
              <p className="text-sm text-gray-600">
                <span className="text-sm font-semibold text-white">
                  {userMetrics?.followingCount}
                </span>{" "}
                Following
              </p>
              <p className="text-sm text-gray-600">
                <span className="text-sm font-semibold text-white">
                  {userMetrics?.followersCount}
                </span>{" "}
                Followers
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
