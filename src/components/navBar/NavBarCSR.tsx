import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import NavbarProfileServer from "./NavbarProfileServer";

const NavbarDynamic = dynamic(() => import("@/components/navBar/Navbar"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  },
});

export const NavbarCSR = () => (
  <NavbarDynamic>
    <NavbarProfileServer />
  </NavbarDynamic>
);
