import { db, meetup } from "@/db";
import { EventEscrow } from "@/services/EventEscrow";
import { NextRequest, NextResponse } from "next/server";
import { Hex } from "viem";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { organizerAddress, eventId, userAddress } = body;

  const attendee = userAddress as Hex;
  const organizer = organizerAddress as Hex;

  try {
    // Check if the event has ended
    await checkIfEventHasEnded(eventId);

    const escrowContract = new EventEscrow({});
    const response = await escrowContract.releaseEscrow(
      organizer,
      eventId,
      attendee
    );

    if (response) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching meetups:", error);
    return NextResponse.json(
      { error: "An error occurred while withdrawing user escrowed funds" },
      { status: 500 }
    );
  }
}

const checkIfEventHasEnded = async (eventId: number) => {
  const [event] = await db.select().from(meetup).where(eq(meetup.id, eventId));

  if (!event) {
    throw new Error("Event not found");
  }

  const currentDate = new Date();
  if (new Date(event.endDate) > currentDate) {
    throw new Error("Event has not ended yet. Cannot withdraw funds.");
  }
};
