import { getAuthSession } from "@/lib/auth";
import React from "react";
import NavbarProfile from "./NavbarProfile";

const NavbarProfileServer = async () => {
  const session = await getAuthSession();

  return (
    <NavbarProfile
      username={session?.user.username ?? ""}
      image={session?.user.image ?? ""}
      name={session?.user.name ?? ""}
    />
  );
};

export default NavbarProfileServer;
