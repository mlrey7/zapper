import { PostMetrics } from "@prisma/client";
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

export const PrismaPostMetricsValidator = z.object({
  id: z.string(),
  postId: z.string(),
  likesCount: z.number(),
  repliesCount: z.number(),
  retweetsCount: z.number(),
});

export const PrismaPostValidator = z.object({
  id: z.string(),
  content: PostContentValidator,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  authorId: z.string(),
  replyToId: z.string().nullable(),
  quoteToId: z.string().nullable(),
  author: z.object({
    name: z.string(),
    username: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export type PrismaPostType = z.infer<typeof PrismaPostValidator>;

type PrismaPostAllType = PrismaPostType & {
  postMetrics: PostMetrics;
  quoteTo: PrismaPostType | null;
  currentLike: boolean;
  currentRetweet: boolean;
};

export const PrismaPostAllValidator: z.ZodType<PrismaPostAllType> =
  PrismaPostValidator.extend({
    postMetrics: PrismaPostMetricsValidator,
    quoteTo: PrismaPostValidator.nullable(),
    currentLike: z.boolean(),
    currentRetweet: z.boolean(),
  });

export const PrismaPostAllArrayValidator = z.array(PrismaPostAllValidator);
