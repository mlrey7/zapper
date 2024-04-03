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
import { Button, buttonVariants } from "./ui/button";
import { MouseEventHandler, startTransition, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PostLikeRequest } from "@/lib/validators/like";
import { boolean } from "zod";
import { cn, formatCompactNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostCreationRequest } from "@/lib/validators/post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostInteractionProps {
  postId: string;
  initialLikesAmount: number;
  initialRepliesAmount: number;
  initialRetweetsAmount: number;
  initialLike: boolean;
  initialRetweet: boolean;
}

const PostInteraction = ({
  initialRepliesAmount,
  initialLikesAmount,
  initialRetweetsAmount,
  postId,
  initialLike,
  initialRetweet,
}: PostInteractionProps) => {
  const [repliesAmount, setRepliesAmount] = useState(initialRepliesAmount);
  const [likesAmount, setLikesAmount] = useState(initialLikesAmount);
  const [retweetsAmount, setRetweetsAmount] = useState(initialRetweetsAmount);
  const [currentLike, setCurrentLike] = useState(initialLike);
  const [currentRetweet, setCurrentRetweet] = useState(initialRetweet);

  const router = useRouter();

  const { mutate: like } = useMutation({
    mutationFn: async () => {
      const payload: PostLikeRequest = {
        postId,
      };

      await axios.patch("/api/post/like", payload);
    },
    onMutate: () => {
      setCurrentLike(true);
      setLikesAmount((prev) => prev + 1);
      startTransition(() => {
        router.refresh();
      });
    },
    onError: () => {
      setCurrentLike(false);
      setLikesAmount((prev) => prev - 1);

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered please try again",
        variant: "destructive",
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
    onMutate: () => {
      setCurrentLike(false);
      setLikesAmount((prev) => prev - 1);
      startTransition(() => {
        router.refresh();
      });
    },
    onError: () => {
      setCurrentLike(true);
      setLikesAmount((prev) => prev + 1);

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered please try again",
        variant: "destructive",
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
    onMutate: () => {
      setCurrentRetweet(true);
      setRetweetsAmount((prev) => prev + 1);
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
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

      {/* <div className="relative">
        {openRetweetDialogOption && (
          <div className="absolute right-0 top-0 z-10 flex w-32 flex-col overflow-visible rounded border bg-background shadow">
            <div
              className="flex items-center justify-center px-4 py-3"
              onClick={handleRetweet}
            >
              <Repeat className={cn("mr-2 h-4 w-4")} />
              <p className="text-sm">Repost</p>
            </div>
            <div className="flex items-center justify-center px-4 py-3">
              <PenLine className={cn("mr-2 h-4 w-4")} />
              <p className="text-sm">Quote</p>
            </div>
          </div>
        )}

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={handleOpenRetweetDialog}
        >
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
      </div> */}

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
