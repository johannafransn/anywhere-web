import { db, meetup, guest } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
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

    // Create the meetup and add the creator as a guest in a transaction
    const result = await db.transaction(async (tx) => {
      const [newMeetup] = await tx
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

      // Add the creator as a guest
      await tx.insert(guest).values({
        meetupId: newMeetup.id,
        userId: creatorUserId,
      });

      return newMeetup;
    });

    return NextResponse.json(result);
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
