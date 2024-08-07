CREATE TABLE IF NOT EXISTS "frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"frame_img_url" varchar(256) NOT NULL,
	"price" varchar(256) NOT NULL,
	"meetup_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guest" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"meetup_id" integer,
	"user_id" integer,
	CONSTRAINT "guest_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meetup" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"image" varchar(256) NOT NULL,
	"escrow_address" varchar(256) NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"date" timestamp,
	"country" varchar(100),
	"city" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"email" varchar(256),
	"name" varchar(256),
	"username" varchar(100),
	"bio" varchar(556),
	"instagram" varchar(100),
	"farcaster" varchar(100),
	"twitter" varchar(100),
	"youtube" varchar(100),
	"avatar" varchar(512),
	CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frame" ADD CONSTRAINT "frame_meetup_id_meetup_id_fk" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest" ADD CONSTRAINT "guest_meetup_id_meetup_id_fk" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest" ADD CONSTRAINT "guest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meetup" ADD CONSTRAINT "meetup_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
