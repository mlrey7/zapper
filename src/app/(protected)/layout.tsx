import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

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
      <div className="container fixed inset-x-0 z-10 grid grid-cols-12">
        <div className="col-span-3 w-full" />
        <div className="col-span-6 w-full border-x bg-background/80 backdrop-blur-md">
          {headerMain}
        </div>
        <div className="col-span-3 w-full">{headerSide}</div>
      </div>

      <div className="container grid grid-cols-12">
        {postModal}
        <div className="col-span-3">
          <Navbar />
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
