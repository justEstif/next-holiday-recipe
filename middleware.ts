import { withUpdatedSession } from "@/middlewares/withUpdatedSession";
import { NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  // TODO add auth guard if /profile
  return await withUpdatedSession(request);
};
