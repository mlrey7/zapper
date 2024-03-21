import z from "zod";

export const PostContent = z.object({
  text: z.string().min(1).max(280),
  images: z.string().array().max(4),
});

export const PostValidator = z.object({
  replyToId: z.string().optional(),
  quoteToId: z.string().optional(),
  content: PostContent,
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
