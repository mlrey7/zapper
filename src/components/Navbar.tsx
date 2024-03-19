import React from "react";
import NavbarMain from "./NavbarMain";
import { getAuthSession } from "@/lib/auth";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="py-4 col-span-3 flex flex-col justify-between pl-8">
      <NavbarMain />
      <div className="flex justify-between items-center pl-6 pr-8">
        <div className="flex ">
          <UserAvatar
            user={{
              name: session?.user.name,
              image: session?.user.image,
            }}
          />
          <div className="flex flex-col ml-2 gap-0.5">
            <p className="font-bold text-sm">{session?.user.name}</p>
            <p className="text-slate-500 text-xs">@{session?.user.username}</p>
          </div>
        </div>
        <Ellipsis className="w-4 h-4" />
      </div>
    </div>
  );
};

export default Navbar;
