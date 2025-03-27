CREATE TYPE "public"."user_notification_type" AS ENUM('NEW_FEATURE', 'FEATURE_UPDATE');--> statement-breakpoint
CREATE TABLE "jotta_user_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "user_notification_type" NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "jotta_user_notification" ADD CONSTRAINT "user_notification_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."jotta_user"("id") ON DELETE cascade ON UPDATE cascade;