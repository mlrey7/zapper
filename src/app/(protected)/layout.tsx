import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-12 container">
      <Navbar />
      <div className="col-span-6 border-x">{children}</div>
      <Sidebar />
    </div>
  );
};

export default Layout;
