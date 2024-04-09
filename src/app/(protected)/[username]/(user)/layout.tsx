import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/controllers/userController";
import UserInteractivity from "./UserInteractivity";
import UserPostsSwitch from "@/components/UserPostsSwitch";

const Layout = async ({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) => {
  const user = await getUser(username);

  if (!user) return null;

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col">
        <div className="relative w-full bg-white sm:h-[200px]">
          <UserAvatar
            user={user}
            className="absolute -bottom-16 left-4 h-32 w-32 border-4 border-background"
          />
        </div>
        <div className="flex h-full w-full flex-1 flex-col px-4 py-3">
          <div className="flex justify-end">
            <UserInteractivity />
          </div>
          <div className="pt-6 text-xl font-bold">{user.name}</div>
          <h6 className="text-sm text-gray-600">@{user.username}</h6>
          <p className="mt-3">placeholder description</p>
          <div className="mt-3 flex gap-6">
            <p className="text-sm text-gray-600">
              <span className="text-sm font-semibold text-white">{1}</span>{" "}
              Following
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-sm font-semibold text-white">{0}</span>{" "}
              Followers
            </p>
          </div>
        </div>
        <UserPostsSwitch username={username} />
      </div>
      <div className="flex w-full flex-col">{children}</div>
    </div>
  );
};

export default Layout;
