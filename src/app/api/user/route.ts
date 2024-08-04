import { findUserByAddress } from "@/database-crud/user";
import { db, user } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req, "req inside 2", req.address);
    const walletAddress = req.address;
    const existingUser = await findUserByAddress(walletAddress);
    if (existingUser) {
      return NextResponse.json(existingUser);
    } else {
      if (walletAddress) {
        const newUser = await db
          .insert(user)
          .values({
            walletAddress: walletAddress,
          })
          .returning();
        return NextResponse.json(newUser[0]);
      } else {
        throw Error("Could not find walletaddress for fid: " + req.fid);
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
