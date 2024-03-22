import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container grid grid-cols-12">
      <div className="col-span-3">
        <Navbar />
      </div>

      <div className="col-span-6 border-x">{children}</div>
      <div className="col-span-3">
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
