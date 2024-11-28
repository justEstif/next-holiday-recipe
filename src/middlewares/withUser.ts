import { NextRequest, NextResponse } from "next/server";
import { pbServer } from "@/lib/pb";

export const withUser = async (request: NextRequest) => {
  const pb = await pbServer(request);

  if (!pb.authStore.model && !request.nextUrl.pathname.startsWith("/auth")) {
    const redirect_to = new URL("/auth", request.url);
    if (request.nextUrl.pathname) {
      redirect_to.search = new URLSearchParams({
        next: request.nextUrl.pathname,
      }).toString();
    } else {
      redirect_to.search = new URLSearchParams({
        next: "/",
      }).toString();
    }

    return NextResponse.redirect(redirect_to);
  }
};
