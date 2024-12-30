import { withLogging } from "@/middlewares/withLogging";
import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	withLogging(request);
	await withUpdatedSession(request);
	return NextResponse.next();
}
