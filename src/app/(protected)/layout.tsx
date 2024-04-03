import Navbar from "@/components/Navbar";
import NavbarProfile from "@/components/NavbarProfile";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const NavbarCSR = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  },
});

const Layout = ({
  children,
  postModal,
  headerMain,
  headerSide,
}: {
  children: React.ReactNode;
  postModal: React.ReactNode;
  headerMain: React.ReactNode;
  headerSide: React.ReactNode;
}) => {
  return (
    <>
      <div className="container fixed inset-x-0 z-20 grid grid-cols-12">
        <div className="pointer-events-none col-span-3 w-full" />
        <div className="col-span-6 w-full border-x bg-background/80 backdrop-blur-md">
          {headerMain}
        </div>
        <div className="col-span-3 w-full">{headerSide}</div>
      </div>

      <div className="container grid grid-cols-12">
        {postModal}
        <div className="col-span-3">
          <NavbarCSR>
            <NavbarProfile />
          </NavbarCSR>
        </div>
        <div className="col-span-6 border-x">{children}</div>
        <div className="col-span-3">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Layout;
