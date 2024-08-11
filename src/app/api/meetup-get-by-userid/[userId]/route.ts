import { db, meetup, guest } from "@/db";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const isPastEvents =
    request.nextUrl.searchParams.get("isPastEvents") === "true";

  const currentDate = new Date();

  try {
    const meetups = await db
      .select({
        id: meetup.id,
        name: meetup.name,
        description: meetup.description,
        image: meetup.image,
        date: meetup.date,
        country: meetup.country,
        city: meetup.city,
      })
      .from(meetup)
      .innerJoin(guest, sql`${guest.meetupId} = ${meetup.id}`)
      .where(
        sql`${guest.userId} = ${userId} AND 
                 ${
                   isPastEvents
                     ? sql`${meetup.date} < ${currentDate}`
                     : sql`${meetup.date} >= ${currentDate}`
                 }`
      )
      .orderBy(meetup.date);

    return NextResponse.json(meetups);
  } catch (error) {
    console.error("Error fetching meetups:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching meetups" },
      { status: 500 }
    );
  }
}
