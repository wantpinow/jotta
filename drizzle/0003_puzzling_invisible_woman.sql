CREATE TABLE "jotta_person_note_mention" (
	"person_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "jotta_person_note_mention_person_id_note_id_pk" PRIMARY KEY("person_id","note_id")
);
--> statement-breakpoint
CREATE TABLE "jotta_person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jotta_person_note_mention" ADD CONSTRAINT "person_note_mention_person_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."jotta_person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jotta_person_note_mention" ADD CONSTRAINT "person_note_mention_note_fkey" FOREIGN KEY ("note_id") REFERENCES "public"."jotta_note"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jotta_person" ADD CONSTRAINT "person_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."jotta_user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jotta_note" ADD CONSTRAINT "note_user_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."jotta_user"("id") ON DELETE cascade ON UPDATE cascade;