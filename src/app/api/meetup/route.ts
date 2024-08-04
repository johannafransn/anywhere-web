import { db, meetup } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req, "MEETUP REQ");
    const { name, description, image, date, creatorUserId } = req.meetup;

    // Validate required fields
    if (!name || !description || !image || !date || !creatorUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //const escrowAddress = callFactoryAndCreateEscrow();
    const escrowAddress = "0x1234567890";
    // Find the user by their wallet address

    // Create the meetup
    const newMeetup = await db
      .insert(meetup)
      .values({
        name,
        description,
        image,
        escrowAddress,
        createdBy: creatorUserId,
        date: new Date(date),
      })
      .returning();

    return NextResponse.json(newMeetup[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const meetups = await db.select().from(meetup);
    return NextResponse.json(meetups);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
