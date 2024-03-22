import React from "react";
import NavbarMain from "./NavbarMain";
import { getAuthSession } from "@/lib/auth";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed ml-20 flex flex-col gap-12 py-4">
      <NavbarMain />
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
    </div>
  );
};

export default Navbar;
