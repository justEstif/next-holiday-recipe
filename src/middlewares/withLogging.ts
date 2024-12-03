import { NextRequest, NextResponse } from "next/server";

export const withLogging = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Exclude static files and API routes from processing
  if (
    !(
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/static/")
    )
  ) {
    console.log(
      `[${new Date().toISOString()}] ${request.method} ${request.url}`,
    );
  }
};
