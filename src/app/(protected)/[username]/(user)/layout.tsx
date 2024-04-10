import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/controllers/userController";
import UserInteractivity from "./UserInteractivity";
import UserPostsSwitch from "@/components/UserPostsSwitch";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

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
        <div className="relative min-h-0 w-full bg-gray-500 sm:h-[200px]">
          {user.coverImage && (
            <Image
              alt="cover image"
              src={user.coverImage}
              height={0}
              width={0}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
              className="h-full w-full object-cover"
            />
          )}
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

          {user.bio && <p className="mt-3">{user.bio}</p>}

          <div className="mt-3 flex gap-6">
            {user.location && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="-ml-0.5 h-4 w-4" />
                <p className="text-sm">{user.location}</p>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-600">
              <CalendarDays className="-ml-0.5 h-4 w-4" />
              <p className="text-sm">
                Joined {format(new Date(user.createdAt), "MMMM y")}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-6">
            <p className="text-sm text-gray-600">
              <span className="text-sm font-semibold text-white">
                {user.userMetrics?.followingCount}
              </span>{" "}
              Following
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-sm font-semibold text-white">
                {user.userMetrics?.followersCount}
              </span>{" "}
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
