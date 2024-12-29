import { pbServer, setAuthCookie } from "@/lib/server/pb";
import { type NextRequest, NextResponse } from "next/server";

export async function withUpdatedSession(request: NextRequest) {
	const pb = await pbServer(request.cookies);
	const res = NextResponse.next();
	setAuthCookie(pb, res.cookies);
	return res;
}
