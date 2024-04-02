"use client";
import NavbarMain from "./NavbarMain";
import { useViewportSize } from "@mantine/hooks";

const floor = (val: number, min: number) => Math.max(val, min);

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const { width } = useViewportSize();
  const BREAKPOINT = 1400;
  const margin = floor(width - BREAKPOINT, 0) / 2;
  const PADDING = 32;

  const navPositionRight =
    width < BREAKPOINT
      ? width - (width - PADDING * 2) / 4 - PADDING
      : width - ((BREAKPOINT - PADDING * 2) / 4 + margin + PADDING);

  return (
    <div
      className="fixed flex flex-col gap-12 py-4 pr-4"
      style={{
        right: navPositionRight,
      }}
    >
      <NavbarMain />
      {children}
    </div>
  );
};

export default Navbar;
