import { db, user } from "@/db";
import { sql } from "drizzle-orm";

export const findUserById = async (id: number) => {
  const existingUser = await db
    .select()
    .from(user)
    .where(sql`${user.id} = ${id}`);
  if (existingUser[0]) {
    return existingUser[0];
  } else {
    return null;
  }
};

export const findUserByAddress = async (walletAddress: number) => {
  const existingUser = await db
    .select()
    .from(user)
    .where(sql`${user.walletAddress} = ${walletAddress}`);
  if (existingUser[0]) {
    return existingUser[0];
  } else {
    return null;
  }
};
