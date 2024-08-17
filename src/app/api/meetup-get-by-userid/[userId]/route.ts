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
        startDate: meetup.startDate,
        endDate: meetup.endDate,
        location: meetup.location,
      })
      .from(meetup)
      .innerJoin(guest, sql`${guest.meetupId} = ${meetup.id}`)
      .where(
        sql`${guest.userId} = ${userId} AND 
                 ${
                   isPastEvents
                     ? sql`${meetup.startDate} < ${currentDate}`
                     : sql`${meetup.startDate} >= ${currentDate}`
                 }`
      )
      .orderBy(meetup.startDate);

    return NextResponse.json(meetups);
  } catch (error) {
    console.error("Error fetching meetups:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching meetups" },
      { status: 500 }
    );
  }
}
