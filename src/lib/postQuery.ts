// ['posts', 'infinite', 'user-posts', authUserId, userId ]
// ['posts', 'infinite', 'user-likes', authUserId, userId ]
// ['posts', 'infinite', 'user-media', authUserId, userId ]
// ['posts', 'infinite', 'user-replies', authUserId, userId ]
// ['posts', 'infinite', 'user-feed', authUserId, {feedType: 'all'} ]
// ['posts', 'infinite', 'user-feed', authUserId, {feedType: 'following'} ]
// ['posts', 'infinite', 'post-comments', authUserId, replyToId ]
// ['post', 'post-current-like', authUserId, postId ]
// ['post', 'post-current-retweet', authUserId, postId ]
// ['post', 'post-metrics', authUserId, postId ]

import { FeedStatusType } from "@/types/feed";

export const postQueryKeys = {
  all: () => ["posts"],
  infinite: () => [...postQueryKeys.all(), "infinite"],
  userPosts: (authUserId: string, userId: string) => [
    ...postQueryKeys.infinite(),
    "user-posts",
    { authUserId },
    { userId },
  ],
  userLikes: (authUserId: string, userId: string) => [
    ...postQueryKeys.infinite(),
    "user-likes",
    { authUserId },
    { userId },
  ],
  userMedia: (authUserId: string, userId: string) => [
    ...postQueryKeys.infinite(),
    "user-media",
    { authUserId },
    { userId },
  ],
  userReplies: (authUserId: string, userId: string) => [
    ...postQueryKeys.infinite(),
    "user-replies",
    { authUserId },
    { userId },
  ],
  userFeed: (
    authUserId: string,
    { feedType }: { feedType: FeedStatusType },
  ) => [
    ...postQueryKeys.infinite(),
    "user-replies",
    { authUserId },
    { feedType },
  ],
  postComments: (authUserId: string, replyToId: string) => [
    ...postQueryKeys.infinite(),
    "user-replies",
    { authUserId },
    { replyToId },
  ],
};
