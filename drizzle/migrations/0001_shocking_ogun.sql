ALTER TABLE "news" ALTER COLUMN "published_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "procurements" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
CREATE UNIQUE INDEX "announcements_slug_idx" ON "announcements" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "procurements_slug_idx" ON "procurements" USING btree ("slug");