import { Like, Post, Retweet, User } from "@prisma/client";

export type ExtendedPost = Post & {
  author: Pick<User, "name" | "username" | "image">;
  likes: Array<Like>;
  replies: Array<Post>;
  retweets: Array<Retweet>;
};

export type PostAndAuthor = Post & {
  author: Pick<User, "name" | "username" | "image">;
};
