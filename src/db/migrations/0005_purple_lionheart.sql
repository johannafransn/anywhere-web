CREATE TABLE IF NOT EXISTS "frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"frame_img_url" varchar(256) NOT NULL,
	"price" varchar(256) NOT NULL,
	"meetup_id" integer,
	"created_at" timestamp DEFAULT now()
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
	"date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"fid" integer NOT NULL,
	"wallet_address" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_fid_unique" UNIQUE("fid"),
	CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frame" ADD CONSTRAINT "frame_meetup_id_meetup_id_fk" FOREIGN KEY ("meetup_id") REFERENCES "meetup"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meetup" ADD CONSTRAINT "meetup_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
