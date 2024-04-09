import Searchbar from "@/components/Searchbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Searchbar />
      {children}
    </>
  );
};

export default Layout;
