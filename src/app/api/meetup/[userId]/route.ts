import { getMeetupByUserId } from "@/database-crud/meetup";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const parts = request.url.split("/");
  const id = parts[parts.length - 1];
  const res = await getMeetupByUserId(Number(id));
  return Response.json(res);
}
