-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post" USING HASH ("authorId");

-- CreateIndex
CREATE INDEX "Post_replyToId_idx" ON "Post" USING HASH ("replyToId");

-- CreateIndex
CREATE INDEX "Post_quoteToId_idx" ON "Post" USING HASH ("quoteToId");

-- CreateIndex
CREATE INDEX "PostMetrics_postId_idx" ON "PostMetrics" USING HASH ("postId");
