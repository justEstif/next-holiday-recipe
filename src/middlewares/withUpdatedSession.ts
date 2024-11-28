import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function withUpdatedSession(request: NextRequest) {
  const pb = new PocketBase(
    process.env.POCKETBASE_URL || "http://127.0.0.1:8090",
  );

  // load the store data from the request cookie string
  const authCookie = request.cookies.get("pb_auth");
  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch (error) {
    console.error("Auth refresh failed:", error);
    pb.authStore.clear();
  }
  const authCookieString = pb.authStore.exportToCookie();

  let pbResponse = NextResponse.next();
  pbResponse.cookies.set("pb_auth", authCookieString, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return pbResponse;
}
