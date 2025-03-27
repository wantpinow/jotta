ALTER TABLE "jotta_user_notification" ALTER COLUMN "type" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "jotta_user_notification" DROP COLUMN "name";--> statement-breakpoint
DROP TYPE "public"."user_notification_type";