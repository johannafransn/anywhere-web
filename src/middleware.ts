import { NextRequest } from "next/server";
import { USER_ID } from "./utils/cookie-auth";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/frames")) {
    const session = request.cookies.get(USER_ID)?.value;
    if (session && request.nextUrl.pathname === "/") {
      return Response.redirect(new URL("/dashboard", request.url));
    }

    if (!session && request.nextUrl.pathname !== "/") {
      return Response.redirect(new URL("/", request.url));
    }
  }
  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
};
