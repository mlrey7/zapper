"use client";

import {
  BarChart,
  Bookmark,
  Heart,
  MessageCircle,
  PenLine,
  Repeat,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PostLikeRequest } from "@/lib/validators/like";
import { cn, formatCompactNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  PostCreationRequest,
  PrismaPostMetricsValidator,
} from "@/lib/validators/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PostMetrics } from "@prisma/client";
import { postQueryKeys } from "@/lib/postQuery";

interface PostInteractionProps {
  postId: string;
  authUserId: string;
}

const PostInteraction = ({ postId, authUserId }: PostInteractionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentLike } = useQuery({
    queryKey: postQueryKeys.detailPostCurrentLike(postId, authUserId),
    queryFn: async () => {
      const data = await fetch(`/api/post/${postId}/currentLike`);
      const like = await data.json();
      return !!like;
    },
  });

  const { data: currentRetweet } = useQuery({
    queryKey: postQueryKeys.detailPostCurrentRetweet(postId, authUserId),
    queryFn: async () => {
      const data = await fetch(`/api/post/${postId}/currentRetweet`);
      const retweet = await data.json();
      return !!retweet;
    },
  });

  const { data: postMetrics } = useQuery({
    queryKey: postQueryKeys.detailPostMetrics(postId, authUserId),
    queryFn: async () => {
      const data = await fetch(`/api/post/${postId}/postMetrics`);
      const postMetrics = await data.json();
      return PrismaPostMetricsValidator.parse(postMetrics);
    },
  });

  const likesAmount = postMetrics?.likesCount ?? 0;
  const repliesAmount = postMetrics?.repliesCount ?? 0;
  const retweetsAmount = postMetrics?.retweetsCount ?? 0;

  const { mutate: like } = useMutation({
    mutationFn: async () => {
      const payload: PostLikeRequest = {
        postId,
      };

      await axios.patch("/api/post/like", payload);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postQueryKeys.detailPostCurrentLike(postId, authUserId),
      });
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentLike(postId, authUserId),
        () => true,
      );

      const previousPostMetrics = queryClient.getQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
      );
      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        (oldPostMetrics: PostMetrics) => {
          return {
            ...oldPostMetrics,
            likesCount: oldPostMetrics.likesCount + 1,
          };
        },
      );

      return { previousPostMetrics };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentLike(postId, authUserId),
        false,
      );

      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        context?.previousPostMetrics,
      );

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered please try again",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostCurrentLike(postId, authUserId),
      });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostMetrics(postId, authUserId),
      });
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: async () => {
      const payload: PostLikeRequest = {
        postId,
      };

      await axios.patch("/api/post/unlike", payload);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postQueryKeys.detailPostCurrentLike(postId, authUserId),
      });
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentLike(postId, authUserId),
        () => false,
      );

      const previousPostMetrics = queryClient.getQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
      );
      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        (oldPostMetrics: PostMetrics) => {
          return {
            ...oldPostMetrics,
            likesCount: oldPostMetrics.likesCount - 1,
          };
        },
      );

      return { previousPostMetrics };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentLike(postId, authUserId),
        true,
      );

      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        context?.previousPostMetrics,
      );

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered please try again",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostCurrentLike(postId, authUserId),
      });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostMetrics(postId, authUserId),
      });
    },
  });

  const { mutate: retweet } = useMutation({
    mutationFn: async ({
      content,
      quoteToId,
      replyToId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        content,
        quoteToId,
        replyToId,
      };

      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postQueryKeys.detailPostCurrentRetweet(postId, authUserId),
      });
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentRetweet(postId, authUserId),
        () => true,
      );

      const previousPostMetrics = queryClient.getQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
      );
      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        (oldPostMetrics: PostMetrics) => {
          return {
            ...oldPostMetrics,
            retweetsCount: oldPostMetrics.retweetsCount + 1,
          };
        },
      );

      return { previousPostMetrics };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        postQueryKeys.detailPostCurrentRetweet(postId, authUserId),
        () => false,
      );

      queryClient.setQueryData(
        postQueryKeys.detailPostMetrics(postId, authUserId),
        context?.previousPostMetrics,
      );

      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostCurrentRetweet(postId, authUserId),
      });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detailPostMetrics(postId, authUserId),
      });

      return toast({
        title: "Success",
        description: "Successfully retweeted",
      });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    currentLike ? unlike() : like();
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();

    retweet({
      content: {
        text: "",
        images: [],
      },
      quoteToId: postId,
    });
  };

  return (
    <div className="flex justify-between">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          router.push(`/compose/post?replyTo=${postId}`, { scroll: false });
        }}
      >
        <MessageCircle className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">
          {formatCompactNumber(repliesAmount)}
        </p>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Repeat
              className={cn("mr-1 h-4 w-4 text-gray-600", {
                "fill-green-600 text-green-600": currentRetweet,
              })}
            />
            <p
              className={cn("text-xs text-gray-600", {
                "text-green-600": currentRetweet,
              })}
            >
              {formatCompactNumber(retweetsAmount)}
            </p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center py-3"
            onClick={handleRetweet}
          >
            <Repeat className={cn("mr-2 h-4 w-4")} />
            <p className="text-sm">Repost</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center py-3"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/compose/post?quoteTo=${postId}`, { scroll: false });
            }}
          >
            <PenLine className={cn("mr-2 h-4 w-4")} />
            <p className="text-sm">Quote</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant={"ghost"} size={"icon"} onClick={handleLike}>
        <Heart
          className={cn("mr-1 h-4 w-4 text-gray-600", {
            "fill-red-600 text-red-600": currentLike,
          })}
        />
        <p
          className={cn("text-xs text-gray-600", {
            "text-red-600": currentLike,
          })}
        >
          {formatCompactNumber(likesAmount)}
        </p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <BarChart className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">
          {formatCompactNumber(repliesAmount + likesAmount + retweetsAmount)}
        </p>
      </Button>
      <div className="flex">
        <Button variant={"ghost"} size={"icon"}>
          <Bookmark className="h-4 w-4 text-gray-600" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <Upload className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default PostInteraction;
