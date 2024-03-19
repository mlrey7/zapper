"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";
import { Bell, Home, Mail, Search, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="py-2 col-span-3">
      <NavigationMenu
        orientation="vertical"
        className="max-w-full justify-start ml-8"
      >
        <NavigationMenuList className="flex-col items-start gap-y-4">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Zap className="h-9 w-9" />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn([
                  navigationMenuTriggerStyle(),
                  { "font-bold": pathname === "/" },
                ])}
                active={pathname === "/"}
              >
                <Home className="w-8 h-8 mr-2" />
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
                <Search className="w-8 h-8 mr-2" />
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
                <Bell className="w-8 h-8 mr-2" />
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
                <Mail className="w-8 h-8 mr-2" />
                <span className="text-lg">Messages</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full mt-4">
            <Button className="w-full font-bold">Post</Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
