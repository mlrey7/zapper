import z from "zod";

export const PostContentValidator = z.object({
  text: z.string().min(1).max(280),
  images: z.string().array().max(4),
});

export const PostValidator = z.object({
  replyToId: z.string().optional(),
  quoteToId: z.string().optional(),
  content: PostContentValidator,
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
