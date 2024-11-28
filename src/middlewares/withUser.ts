import { NextRequest, NextResponse } from "next/server";
import { PB_COOKIE_NAME } from "@/lib/pb";

export const withUser = async (request: NextRequest) => {
  const authCookie = request.cookies.get(PB_COOKIE_NAME);
  if (!authCookie) {
    return NextResponse.redirect("/");
  }
  return NextResponse.next();
};
