import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { withUser } from "@/middlewares/withUser";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/recipes",
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

export const middleware = async (request: NextRequest) => {

  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  await withUpdatedSession(request);

  const { pathname } = request.nextUrl;
  if (isProtectedRoute(pathname)) {
    await withUser(request);
  }

  return NextResponse.next();
};
