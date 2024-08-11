import { findUserByAddress } from "@/database-crud/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const parts = request.url.split("/");
  const walletAddress = parts[parts.length - 1];
  console.log(walletAddress, "in request this is ID", request.url);
  const res = await findUserByAddress(walletAddress);
  return Response.json(res);
}
