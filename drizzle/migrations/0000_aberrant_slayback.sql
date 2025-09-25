CREATE TABLE "tags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "tags" SET DATA TYPE varchar(255)[];--> statement-breakpoint
ALTER TABLE "directory_entries" ADD CONSTRAINT "directory_entries_tag_tags_id_fk" FOREIGN KEY ("tag") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entries" DROP COLUMN "order";