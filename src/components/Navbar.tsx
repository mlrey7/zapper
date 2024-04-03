"use client";
import { useEffect, useState } from "react";
import NavbarMain from "./NavbarMain";
import { useViewportSize } from "@mantine/hooks";

const floor = (val: number, min: number) => Math.max(val, min);

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { width } = useViewportSize();
  const BREAKPOINT = 1400;
  const margin = floor(width - BREAKPOINT, 0) / 2;
  const PADDING = 32;
  const [navPositionRight, setNavPositionRight] = useState(0);

  useEffect(() => {
    const x =
      width < BREAKPOINT
        ? width - (width - PADDING * 2) / 4 - PADDING
        : width - ((BREAKPOINT - PADDING * 2) / 4 + margin + PADDING);
    setNavPositionRight(x);
  }, [width, margin]);

  return (
    <div
      className="fixed flex flex-col gap-12 py-4 pr-4 lg:w-64"
      style={{
        right: navPositionRight != 0 ? navPositionRight : "75%",
      }}
    >
      <NavbarMain />
      {children}
    </div>
  );
};

export default Navbar;
