import { findUserByAddress } from "@/database-crud/user";
import { db, user } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { walletAddress, username, name, email, avatar } = req;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const existingUser = await findUserByAddress(walletAddress);

    if (existingUser) {
      // Update existing user with new information
      const updatedUser = await db
        .update(user)
        .set({
          username: username || existingUser.username,
          name: name || existingUser.name,
          email: email || existingUser.email,
          avatar: avatar || existingUser.avatar,
        })
        .where(eq(user.id, existingUser.id))
        .returning();

      return NextResponse.json(updatedUser[0]);
    } else {
      // Create new user
      const newUser = await db
        .insert(user)
        .values({
          walletAddress,
          username,
          name,
          email,
          avatar,
        })
        .returning();

      return NextResponse.json(newUser[0]);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
