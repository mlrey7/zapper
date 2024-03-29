"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Zap, Home, Search, Bell, Mail } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { usePathname, useRouter } from "next/navigation";

const NavbarMain = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <NavigationMenu
      orientation="vertical"
      className="flex w-full flex-col justify-start"
    >
      <NavigationMenuList className="w-full flex-col items-start gap-y-4">
        <NavigationMenuItem>
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Zap className="h-9 w-9" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn([
                navigationMenuTriggerStyle(),
                { "font-bold": pathname === "/home" },
              ])}
              active={pathname === "/home"}
            >
              <Home className="mr-2 h-8 w-8" />
              <span className="text-lg">Home</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/search" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn([
                navigationMenuTriggerStyle(),
                { "font-bold": pathname === "/search" },
              ])}
              active={pathname === "/search"}
            >
              <Search className="mr-2 h-8 w-8" />
              <span className="text-lg">Explore</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/notifications" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn([
                navigationMenuTriggerStyle(),
                { "font-bold": pathname === "/notifications" },
              ])}
              active={pathname === "/notifications"}
            >
              <Bell className="mr-2 h-8 w-8" />
              <span className="text-lg">Notifications</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/mesages" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn([
                navigationMenuTriggerStyle(),
                { "font-bold": pathname === "/messages" },
              ])}
              active={pathname === "/messages"}
            >
              <Mail className="mr-2 h-8 w-8" />
              <span className="text-lg">Messages</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mt-4 w-full">
          <Button
            className="w-full font-bold"
            onClick={() => {
              router.push("/compose/post", {
                scroll: false,
              });
            }}
          >
            Post
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarMain;
