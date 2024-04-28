import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";
import React from "react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar = React.forwardRef<HTMLSpanElement, UserAvatarProps>(
  ({ user, ...props }: UserAvatarProps, ref) => {
    return (
      <Avatar {...props} ref={ref}>
        {user.image ? (
          <AvatarImage src={user.image} referrerPolicy="no-referrer" />
        ) : (
          <AvatarFallback>
            <span className="sr-only">{user?.name}</span>
            <Icons.user />
          </AvatarFallback>
        )}
      </Avatar>
    );
  },
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
