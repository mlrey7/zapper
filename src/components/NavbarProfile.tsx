import { getAuthSession } from "@/lib/auth";
import React from "react";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

const NavbarProfile = async () => {
  const session = await getAuthSession();

  return (
    <div className="flex items-center justify-between">
      <div className="flex ">
        <UserAvatar
          user={{
            name: session?.user.name,
            image: session?.user.image,
          }}
        />
        <div className="ml-2 flex flex-col gap-0.5">
          <p className="text-sm font-bold">{session?.user.name}</p>
          <p className="text-xs text-slate-500">@{session?.user.username}</p>
        </div>
      </div>
      <Ellipsis className="h-4 w-4" />
    </div>
  );
};

export default NavbarProfile;
