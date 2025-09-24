CREATE TABLE "tags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "tags" ("id", "created_at", "updated_at")
SELECT DISTINCT unnest("tags"), now(), now() FROM "posts" WHERE "tags" IS NOT NULL;
--> statement-breakpoint
INSERT INTO "tags" ("id", "created_at", "updated_at")
SELECT DISTINCT "tag", now(), now() FROM "directory_entries" WHERE "tag" IS NOT NULL
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "tags" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "directory_entries" ADD CONSTRAINT "directory_entries_tag_tags_id_fk" FOREIGN KEY ("tag") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;