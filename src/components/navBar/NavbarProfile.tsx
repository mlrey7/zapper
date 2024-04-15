"use client";
import React from "react";
import UserAvatar from "../UserAvatar";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";

const NavbarProfile = ({
  name,
  username,
  image,
}: {
  name: string;
  username: string;
  image: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("flex h-min items-center justify-between px-2 py-2")}
          variant={"ghost"}
        >
          <div className="flex">
            <UserAvatar
              user={{
                name,
                image,
              }}
            />
            <div className="ml-2 flex flex-col items-start gap-0.5">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs text-slate-500">@{username}</p>
            </div>
          </div>
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]">
        <DropdownMenuItem
          className="flex cursor-pointer items-center py-3"
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          <p className="text-sm font-bold">Log out @{username}</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarProfile;
