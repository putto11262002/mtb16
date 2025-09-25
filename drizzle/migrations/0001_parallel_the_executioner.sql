ALTER TABLE "persons" ADD COLUMN "superior" uuid;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_superior_persons_id_fk" FOREIGN KEY ("superior") REFERENCES "public"."persons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" DROP COLUMN "order";