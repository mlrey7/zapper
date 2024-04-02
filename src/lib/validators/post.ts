import z from "zod";

export const PostContentValidator = z.object({
  text: z.string().max(280),
  images: z.string().array().max(4),
});

export type PostContentType = z.infer<typeof PostContentValidator>;

export const PostValidator = z.object({
  replyToId: z.string().optional(),
  quoteToId: z.string().optional(),
  content: PostContentValidator,
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
