-- DropIndex
DROP INDEX "Comment_authorId_idx";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "Post_content_idx";

-- DropIndex
DROP INDEX "Post_published_createdAt_idx";

-- DropIndex
DROP INDEX "Post_published_idx";

-- DropIndex
DROP INDEX "Post_tags_idx";

-- DropIndex
DROP INDEX "Post_views_idx";

-- DropIndex
DROP INDEX "PostLike_postId_idx";

-- DropIndex
DROP INDEX "PostLike_userId_idx";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "attachmentUrls" TEXT[];

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Comment_postId_parentId_idx" ON "Comment"("postId", "parentId");

-- CreateIndex
CREATE INDEX "Comment_authorId_createdAt_idx" ON "Comment"("authorId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Post_published_createdAt_id_idx" ON "Post"("published", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_authorId_published_createdAt_idx" ON "Post"("authorId", "published", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_tags_published_createdAt_idx" ON "Post"("tags", "published", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Post_views_idx" ON "Post"("views" DESC);

-- CreateIndex
CREATE INDEX "PostLike_userId_createdAt_idx" ON "PostLike"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "PostLike_postId_createdAt_idx" ON "PostLike"("postId", "createdAt" DESC);
