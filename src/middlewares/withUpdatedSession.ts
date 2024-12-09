import { pbServer } from "@/lib/server/pb";
import { NextResponse } from "next/server";

export async function withUpdatedSession() {
  const pb = await pbServer();

  const authCookieString = pb.authStore.exportToCookie();

  let res = NextResponse.next();
  res.cookies.set("pb_auth", authCookieString, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res;
}
