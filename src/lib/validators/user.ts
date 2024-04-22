import z from "zod";

export const UserFollowValidator = z.object({
  followingId: z.string(),
});

export type UserFollowRequest = z.infer<typeof UserFollowValidator>;

export const UserProfileValidator = z.object({
  name: z.string().min(3).max(50),
  bio: z.string().max(160),
  location: z.string().max(30),
  image: z.string().nullable(),
  coverImage: z.string().nullable(),
});

export type PrismaUserType = z.infer<typeof UserProfileValidator>;
