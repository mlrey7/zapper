import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Layout = ({
  children,
  postModal,
}: {
  children: React.ReactNode;
  postModal: React.ReactNode;
}) => {
  return (
    <>
      <Header />
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
