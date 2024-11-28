import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await withUpdatedSession(request);
}
