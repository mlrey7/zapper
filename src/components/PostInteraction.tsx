"use client";

import {
  BarChart,
  Bookmark,
  Heart,
  MessageCircle,
  Repeat,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface PostInteractionProps {
  postId: string;
  initialLikesAmount: number;
  initialRepliesAmount: number;
  initialRetweetsAmount: number;
}

const PostInteraction = ({
  initialRepliesAmount,
  initialLikesAmount,
  initialRetweetsAmount,
  postId,
}: PostInteractionProps) => {
  const [repliesAmount, setRepliesAmount] = useState(initialRepliesAmount);
  const [likesAmount, setLikesAmount] = useState(initialLikesAmount);
  const [retweetsAmount, setRetweetsAmount] = useState(initialRetweetsAmount);

  return (
    <div className="mt-3 flex justify-between">
      <Button variant={"ghost"} size={"icon"}>
        <MessageCircle className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">{repliesAmount}</p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <Repeat className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">{retweetsAmount}</p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <Heart className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">{likesAmount}</p>
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <BarChart className="mr-1 h-4 w-4 text-gray-600" />
        <p className="text-xs text-gray-600">{repliesAmount}</p>
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
