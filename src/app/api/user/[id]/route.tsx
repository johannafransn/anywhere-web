import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/database-crud/user";

export async function GET(request: NextRequest) {
  const parts = request.url.split("/");
  const id = parts[parts.length - 1];
  console.log(id, "in request this is ID", request.url);
  const res = await findUserById(Number(id));
  return Response.json(res);
}
