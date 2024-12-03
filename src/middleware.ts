import { NextRequest, NextResponse } from "next/server";
import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { withUser } from "@/middlewares/withUser";
import { withLogging } from "@/middlewares/withLogging";

export async function middleware(request: NextRequest) {
  withLogging(request);
  await withUpdatedSession(request);
  await withUser(request);
  return NextResponse.next();
}
