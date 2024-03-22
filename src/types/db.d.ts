import { Post, User } from "@prisma/client";

export type ExtendedPost = Post & {
  author: Pick<User, "name" | "username" | "image">;
};
