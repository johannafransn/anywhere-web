import { db, frame, meetup } from "@/db";
import { sql } from "drizzle-orm";

type Meetup = {
  id: number;
  createdAt: Date | null;
  frameImgUrl: string;
  price: string;
  meetupId: number | null;
}[];
//CRUD operations goes here
//This file should handle all data calls to the "meetup" table in DB
export async function createMeetup(name: string) {
  if (name) {
    return {
      success: true,
    };
  } else throw Error("No .env variables for operator");
}

export const findMeetupById = async (meetupId: number) => {
  const meetup = await db
    .select()
    .from(frame)
    .where(sql`${frame.id} = ${meetupId}`);
  if (meetup[0]) {
    return meetup[0];
  } else {
    return null;
  }
};

export const getMeetupByUserId = async (userId: number) => {
  const meetups = await db
    .select()
    .from(meetup)
    .where(sql`${meetup.createdBy} = ${userId}`);
  if (meetups) {
    return meetups;
  } else {
    return null;
  }
};
