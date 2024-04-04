import FeedSwitch from "./FeedSwitch";
import Searchbar from "./Searchbar";

const Header = () => {
  return (
    <div className="container fixed inset-x-0 z-10 grid grid-cols-12">
      <div className="col-span-3 w-full"></div>
      <div className="col-span-6 w-full border-x border-b bg-background/80 backdrop-blur-md">
        <FeedSwitch />
      </div>
      <div className="col-span-3 w-full">
        <Searchbar />
      </div>
    </div>
  );
};

export default Header;
