/* eslint-disable jsx-a11y/alt-text */
"use client";

import UserAvatar from "./UserAvatar";
import { User } from "@prisma/client";
import {
  CalendarClock,
  Earth,
  Image,
  ListTodo,
  MapPin,
  Smile,
} from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

interface MiniCreatePostProps {
  user: Pick<User, "name" | "image">;
}

const MiniCreatePost = ({ user }: MiniCreatePostProps) => {
  const [input, setInput] = useState("");

  return (
    <div className="flex w-full items-start border-b p-3">
      <UserAvatar user={user} className="mr-1" />
      <div className="flex w-full flex-col pt-1.5">
        <TextareaAutosize
          value={input}
          placeholder="What is happening?!"
          onChange={(e) => setInput(e.target.value)}
          className="flex min-h-[40px] w-full resize-none rounded-md bg-background px-2 text-xl outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div>{/* Display attached images */}</div>
        <Button
          className="w-fit px-2 font-medium text-blue-500 hover:text-blue-500"
          variant={"ghost"}
          size={"sm"}
        >
          <Earth className="mr-1 h-4 w-4 text-sm" />
          Everyone can reply
        </Button>
        <Separator className="my-3" />
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <ListTodo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <CalendarClock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <MapPin className="h-4 w-4" />
          </Button>
          <div className="flex-grow"></div>
          <Button>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default MiniCreatePost;
