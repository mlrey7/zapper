import FeedStatusProvider from "@/components/FeedStatusProvider";
import { NavbarCSR } from "@/components/navBar/NavBarCSR";
import Sidebar from "@/components/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const Layout = async ({
  children,
  postModal,
  headerMain,
  headerSide,
  postImageDetail,
}: {
  children: React.ReactNode;
  postModal: React.ReactNode;
  headerMain: React.ReactNode;
  headerSide: React.ReactNode;
  postImageDetail: React.ReactNode;
}) => {
  const session = await getAuthSession();
  if (!session) redirect("/");

  return (
    <FeedStatusProvider>
      {postImageDetail}
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
          <NavbarCSR />
        </div>
        <div className="col-span-6 border-x">{children}</div>
        <div className="col-span-3">
          <Sidebar />
        </div>
      </div>
    </FeedStatusProvider>
  );
};

export default Layout;
