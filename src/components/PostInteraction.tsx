"use client";

import {
  BarChart,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat,
  Upload,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { MouseEventHandler, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PostLikeRequest } from "@/lib/validators/like";
import { boolean } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostInteractionProps {
  postId: string;
  initialLikesAmount: number;
  initialRepliesAmount: number;
  initialRetweetsAmount: number;
  initialLike: boolean;
}

const PostInteraction = ({
  initialRepliesAmount,
  initialLikesAmount,
  initialRetweetsAmount,
  postId,
  initialLike,
}: PostInteractionProps) => {
  const [repliesAmount, setRepliesAmount] = useState(initialRepliesAmount);
  const [likesAmount, setLikesAmount] = useState(initialLikesAmount);
  const [retweetsAmount, setRetweetsAmount] = useState(initialRetweetsAmount);
  const [currentLike, setCurrentLike] = useState(initialLike);
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
      router.refresh();
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
      router.refresh();
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    currentLike ? unlike() : like();
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
        <p className="text-xs text-gray-600">{repliesAmount}</p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <Repeat className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">{retweetsAmount}</p>
      </Button>
      <Button variant={"ghost"} size={"icon"} onClick={handleLike}>
        <Heart
          className={cn("mr-1 h-4 w-4 text-gray-600", {
            "fill-red-500 text-red-500": currentLike,
          })}
        />
        <p
          className={cn("text-xs text-gray-600", {
            "text-red-500": currentLike,
          })}
        >
          {likesAmount}
        </p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <BarChart className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">
          {repliesAmount + likesAmount + retweetsAmount}
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
