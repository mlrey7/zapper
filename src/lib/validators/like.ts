import z from "zod";

export const PostLikeValidator = z.object({
  postId: z.string(),
});

export type PostLikeRequest = z.infer<typeof PostLikeValidator>;
