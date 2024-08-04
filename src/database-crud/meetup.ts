import { db, frame, meetup } from "@/db";
import { sql } from "drizzle-orm";

//CRUD operations goes here
//This file should handle all data calls to the "meetup" table in DB
export async function createMeetup(name: string) {
  if (name) {
    return {
      success: true,
    };
  } else throw Error("No .env variables for operator");
}

export const findMeetupById = async (frameId: number) => {
  const existingFrame = await db
    .select()
    .from(frame)
    .where(sql`${frame.id} = ${frameId}`);
  if (existingFrame[0]) {
    return {
      frame: existingFrame[0],
      zoraUrl: `https://zora.co/collect/base:${existingFrame[0].nftTokenAddress}/1`,
    };
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
