import z from "zod";

export const UserFollowValidator = z.object({
  followingId: z.string(),
});

export type UserFollowRequest = z.infer<typeof UserFollowValidator>;
