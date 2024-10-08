import { db, meetup, guest, user } from "@/db";
import { EventEscrow } from "@/services/EventEscrow";
import { EVENT_ESCROW_ADDRESS_BASE_TESTNET as escrowAddress } from "@/utils/constants";
import { and, eq, exists } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Hex } from "viem";

export type MeetupData = {
  name: string;
  description: string;
  location: string;
  image: File | null;
  imageUrl: string | null;
  startDateTime: string;
  endDateTime: string;
  attendanceFee: string;
  capacity: number;
  visibility: string;
  organizerWalletAddress: string | Hex;
  creatorUserId: any;
};

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const {
      name,
      description,
      imageUrl,
      startDateTime,
      endDateTime,
      creatorUserId,
      location,
      attendanceFee,
      capacity,
      visibility,
      organizerWalletAddress,
    } = req.meetup as MeetupData;

    console.log(req.meetup, "req.meetup <---");

    // Check if imageUrl is null or undefined
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Create an object to track missing fields
    const missingFields: Record<string, boolean> = {
      name: !name,
      description: !description,
      imageUrl: !imageUrl,
      startDateTime: !startDateTime,
      endDateTime: !endDateTime,
      creatorUserId: !creatorUserId,
      attendanceFee: !attendanceFee,
      capacity: !capacity,
      visibility: !visibility,
      organizerWalletAddress: !organizerWalletAddress,
      location: !location,
    };

    // Check if any fields are missing
    const missingFieldNames = Object.keys(missingFields).filter(
      (field) => missingFields[field]
    );

    if (missingFieldNames.length > 0) {
      console.log("Missing required fields:", missingFieldNames);
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: missingFieldNames,
        },
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
          image: imageUrl,
          organizerWalletAddress,
          createdBy: creatorUserId,
          startDate: new Date(startDateTime),
          endDate: new Date(endDateTime),
          location,
          capacity,
          visibility,
          attendanceFee,
        })
        .returning();

      // Add the creator as a guest
      await tx.insert(guest).values({
        meetupId: newMeetup.id,
        userId: creatorUserId,
      });

      return newMeetup;
    });

    const eventEscrowContract = new EventEscrow({});
    const txReceipt = await eventEscrowContract.createEvent(
      organizerWalletAddress as Hex,
      result.id,
      attendanceFee as string | number
    );
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
