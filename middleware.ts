import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { withUser } from "@/middlewares/withUser";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/recipes/new",
  "/recipes/submit",
  "/recipes/:id/edit",
  "/users/:username/edit",
  "/logout",
  "/admin",
];

const isProtectedRoute = (pathname: string) => {
  return protectedRoutes.some((route) => {
    // Convert route patterns with dynamic parameters into regular expressions
    const routePattern = "^" + route.replace(/:\w+/g, "[^/]+") + "$";
    const regex = new RegExp(routePattern);
    return regex.test(pathname);
  });
};

export const middleware = async (request: NextRequest) => {
  await withUpdatedSession(request);

  const { pathname } = request.nextUrl;
  if (isProtectedRoute(pathname)) {
    await withUser(request);
  }

  return NextResponse.next();
};
