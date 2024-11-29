import { NextRequest, NextResponse } from "next/server";
import { pbServer } from "@/lib/pb";

const PROTECTED_ROUTES = [
  "/recipes/new",
  "/recipes/submit",
  "/recipes/:id/edit",
  "/users/:id/edit",
  "/logout",
];

const isProtectedRoute = (pathname: string) => {
  return PROTECTED_ROUTES.some((route) => {
    // Convert route patterns with dynamic parameters into regular expressions
    const routePattern = "^" + route.replace(/:\w+/g, "[^/]+") + "$";
    const regex = new RegExp(routePattern);
    return regex.test(pathname);
  });
};

export const withUser = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (isProtectedRoute(pathname)) {
    const pb = await pbServer(request);
    if (!pb.authStore.model) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
};
