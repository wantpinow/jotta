ALTER TABLE "jotta_user" ADD COLUMN "google_id" text;--> statement-breakpoint
ALTER TABLE "jotta_user" ADD CONSTRAINT "jotta_user_google_id_unique" UNIQUE("google_id");