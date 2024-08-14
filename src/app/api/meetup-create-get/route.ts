import { db, meetup, guest, user } from "@/db";
import { EventEscrow } from "@/services/EventEscrow";
import { EVENT_ESCROW_ADDRESS_BASE_TESTNET as escrowAddress } from "@/utils/constants";
import { and, eq, exists } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const {
      name,
      description,
      image,
      date,
      creatorUserId,
      city,
      country,
      attendanceFee,
    } = req.meetup;

    // Validate required fields
    if (!name || !description || !image || !date || !creatorUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
          city,
          country,
        })
        .returning();

      // Add the creator as a guest
      await tx.insert(guest).values({
        meetupId: newMeetup.id,
        userId: creatorUserId,
      });

      return newMeetup;
    });

    const eventEscrow = new EventEscrow();
    const txReceipt = await eventEscrow.createEvent(result.id, attendanceFee);
    if (!txReceipt) {
      throw Error("Failed to create event");
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      const meetupsWithCreatorsAndGuestStatus = await db
        .select({
          meetup: meetup,
          creator: {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            farcaster: user.farcaster,
            twitter: user.twitter,
            instagram: user.instagram,
          },
        })
        .from(meetup)
        .leftJoin(user, eq(meetup.createdBy, user.id));

      return NextResponse.json(meetupsWithCreatorsAndGuestStatus);
    }

    const meetupsWithCreatorsAndGuestStatus = await db
      .select({
        meetup: meetup,
        creator: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          farcaster: user.farcaster,
          twitter: user.twitter,
          instagram: user.instagram,
        },
        isGuest: exists(
          db
            .select()
            .from(guest)
            .where(and(eq(guest.meetupId, meetup.id), eq(guest.userId, userId)))
        ),
      })
      .from(meetup)
      .leftJoin(user, eq(meetup.createdBy, user.id));

    return NextResponse.json(meetupsWithCreatorsAndGuestStatus);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
