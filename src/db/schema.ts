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
  description: varchar("description", { length: 1000 }).notNull(), // Increased length for longer descriptions
  image: varchar("image", { length: 256 }).notNull(),
  organizerWalletAddress: varchar("organizer_wallet_address", {
    length: 42,
  }).notNull(), // Ethereum address length
  createdBy: integer("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location", { length: 256 }).notNull(),
  capacity: integer("capacity").notNull(),
  visibility: varchar("visibility", { length: 50 }).notNull(),
  attendanceFee: varchar("attendance_fee", { length: 78 }).notNull(), // Changed to varchar
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
