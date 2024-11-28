import { NextRequest, NextResponse } from "next/server";
import { pbServer } from "@/lib/pb";

export const withUser = async (request: NextRequest) => {
  const pb = await pbServer(request);
  if (!pb.authStore.model) {
    return NextResponse.redirect("/");
  }
  return NextResponse.next();
};
