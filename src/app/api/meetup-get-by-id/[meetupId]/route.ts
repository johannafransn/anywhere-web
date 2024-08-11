import { db } from "@/db";
import { meetup, user, guest } from "@/db/schema";
import { eq, and, exists, count } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { meetupId: string } }
) {
  try {
    const meetupId = parseInt(params.meetupId);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let meetupWithDetails;

    if (!userId) {
      meetupWithDetails = await db
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
            bio: user.bio,
          },
          guestCount: count(guest.id).as("guestCount"),
        })
        .from(meetup)
        .leftJoin(user, eq(meetup.createdBy, user.id))
        .leftJoin(guest, eq(meetup.id, guest.meetupId))
        .where(eq(meetup.id, meetupId))
        .groupBy(meetup.id, user.id);
    } else {
      meetupWithDetails = await db
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
            bio: user.bio,
          },
          guestCount: count(guest.id).as("guestCount"),
          isGuest: exists(
            db
              .select()
              .from(guest)
              .where(
                and(
                  eq(guest.meetupId, meetup.id),
                  eq(guest.userId, parseInt(userId))
                )
              )
          ),
        })
        .from(meetup)
        .leftJoin(user, eq(meetup.createdBy, user.id))
        .leftJoin(guest, eq(meetup.id, guest.meetupId))
        .where(eq(meetup.id, meetupId))
        .groupBy(meetup.id, user.id);
    }

    // Fetch guests
    const guests = await db
      .select({
        id: guest.userId,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      })
      .from(guest)
      .leftJoin(user, eq(guest.userId, user.id))
      .where(eq(guest.meetupId, meetupId))
      .limit(5); // Limit to 5 guests for performance, adjust as needed

    const result = {
      ...meetupWithDetails[0],
      guests,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
