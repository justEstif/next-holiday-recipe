import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { withUser } from "@/middlewares/withUser";
import { NextRequest, NextResponse } from "next/server";
import { withLogging } from "./middlewares/withLogging";

export const middleware = async (request: NextRequest) => {
  withLogging(request);
  await withUpdatedSession(request);
  return await withUser(request);
};
