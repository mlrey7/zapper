-- CreateTable
CREATE TABLE "PostMetrics" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "likesCount" INTEGER NOT NULL,
    "repliesCount" INTEGER NOT NULL,
    "retweetsCount" INTEGER NOT NULL,

    CONSTRAINT "PostMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostMetrics_postId_key" ON "PostMetrics"("postId");

-- AddForeignKey
ALTER TABLE "PostMetrics" ADD CONSTRAINT "PostMetrics_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
