import { NextRequest, NextResponse } from "next/server";
import { pbServer } from "@/lib/pb";

export const withUser = async (request: NextRequest) => {
  const pb = await pbServer(request);
  console.log("Model in withUser", pb.authStore.model);
  if (!pb.authStore.model) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
};
