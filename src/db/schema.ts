import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  walletAddress: varchar("wallet_address", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),

  // New fields
  email: varchar("email", { length: 256 }),
  name: varchar("name", { length: 256 }),
  username: varchar("username", { length: 100 }).unique(),
  bio: varchar("bio", { length: 556 }),
  instagram: varchar("instagram", { length: 100 }),
  farcaster: varchar("farcaster", { length: 100 }),
  twitter: varchar("twitter", { length: 100 }),
  youtube: varchar("youtube", { length: 100 }),
  avatar: varchar("avatar", { length: 512 }),
});

export const meetup = pgTable("meetup", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  image: varchar("image", { length: 256 }).notNull(),
  escrowAddress: varchar("escrow_address", { length: 256 }).notNull(),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  date: timestamp("date"),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
});

export const guest = pgTable("guest", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  meetupId: integer("meetup_id").references(() => meetup.id),
  userId: integer("user_id").references(() => user.id),
});

export const frame = pgTable("frame", {
  id: serial("id").primaryKey(),
  frameImgUrl: varchar("frame_img_url", { length: 256 }).notNull(),
  price: varchar("price", { length: 256 }).notNull(),
  meetupId: integer("meetup_id").references(() => meetup.id),
  createdAt: timestamp("created_at").defaultNow(),
});
