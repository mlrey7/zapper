import { Like, Post, PostMetrics, Retweet, User } from "@prisma/client";

export type ExtendedPost = Post & {
  author: Pick<User, "name" | "username" | "image">;
  likes: Array<Like>;
  replies: Array<Post>;
  retweets: Array<Retweet>;
  postMetrics?: PostMetrics | null;
};

export type PostAndAuthor = Post & {
  author: Pick<User, "name" | "username" | "image">;
  postMetrics?: PostMetrics | null;
};

export type PostAndAuthorAll = PostAndAuthor & {
  quoteTo: PostAndAuthor | null;
};
