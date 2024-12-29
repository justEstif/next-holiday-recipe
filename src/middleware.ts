import { withLogging } from "@/middlewares/withLogging";
import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { withUser } from "@/middlewares/withUser";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	withLogging(request);
	await withUpdatedSession(request);
	await withUser(request);
	return NextResponse.next();
}
