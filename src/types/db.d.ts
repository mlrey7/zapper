import {
  Like,
  Post,
  PostMetrics,
  Retweet,
  User,
  UserMetrics,
} from "@prisma/client";

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

export type PostAndAuthorAllWithLikesAndRetweets = PostAndAuthorAll & {
  currentLike: boolean;
  currentRetweet: boolean;
};

export type PostAndAuthorAllWithReply = PostAndAuthorAll & {
  replyTo: PostAndAuthorAll | null;
};

export type UserPublic = Omit<User, "email" | "emailVerified">;

export type UserWithPosts = UserPublic & {
  posts: Array<PostAndAuthorAll>;
};
