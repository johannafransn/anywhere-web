import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust the import path as necessary
import { guest } from "@/db/schema"; // Adjust the import path as necessary

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { meetupId, userId } = req;

    await db.insert(guest).values({
      meetupId,
      userId,
    });

    return new NextResponse(
      JSON.stringify({ message: "Spot reserved successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error, "wats error reserve spot");
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
