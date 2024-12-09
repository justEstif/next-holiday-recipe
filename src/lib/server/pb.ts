import PocketBase from "pocketbase";
import { cookies } from "next/headers";
import { User } from "@/types";

export const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
export const PB_COOKIE_NAME = "pb_auth";

/**
 * Initializes and returns a new instance of the PocketBase client.
 *
 * If a user session exists (determined by a cookie), it loads the session
 * into the PocketBase client.
 *
 * The session is refreshed if valid, or cleared  if the refresh fails.
 *
 * @async
 * @function pbServer
 * @returns {Promise<PocketBase>} A new instance of the PocketBase client with the user's session (if available).
 */
export async function pbServer(): Promise<PocketBase> {
  const pb = new PocketBase(PB_URL);
  const authCookie = (await cookies()).get(PB_COOKIE_NAME);
  if (authCookie) {
    pb.authStore.loadFromCookie(`${PB_COOKIE_NAME}=${authCookie.value}`);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch (error) {
    console.error("Auth refresh failed:", error);
    pb.authStore.clear();
  }

  return pb;
}

export async function getLoggedInUser() {
  try {
    const pb = await pbServer();
    const currentUser = pb.authStore.model;
    return currentUser;
  } catch (error) {
    console.error("Error fetching current user", error);
    return null;
  }
}

export async function getUser(userId: string) {
  try {
    const pb = await pbServer();
    const userData = await pb.collection("users").getOne<User>(userId, {
      expand: "relField1,relField2.subRelField",
    });
    return userData;
  } catch (error) {
    console.error("Error fetching user data", error);
    return null;
  }
}
