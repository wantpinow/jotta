CREATE TABLE "jotta_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jotta_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"github_id" text,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "jotta_user_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "jotta_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "jotta_session" ADD CONSTRAINT "session_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."jotta_user"("id") ON DELETE cascade ON UPDATE cascade;