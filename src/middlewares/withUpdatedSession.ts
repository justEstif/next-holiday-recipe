import { pbServer } from "@/lib/pb";
import { NextRequest, NextResponse } from "next/server";

export async function withUpdatedSession(request: NextRequest) {
  const pb = await pbServer(request);

  const authCookieString = pb.authStore.exportToCookie();

  let withPbResponse = NextResponse.next();
  withPbResponse.cookies.set("pb_auth", authCookieString, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return withPbResponse;
}
