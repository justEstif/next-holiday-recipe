import PocketBase from "pocketbase";
import { CookieStore, User } from "@/types";

export const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
export const PB_COOKIE_NAME = "pb_auth";

export async function pbServer(
  cookieStore: CookieStore,
) {
  const pb = new PocketBase(PB_URL);

  const authCookie = cookieStore.get(PB_COOKIE_NAME);
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

export function getLoggedInUser(pb: PocketBase) {
  try {
    const currentUser = pb.authStore.model;
    return currentUser;
  } catch (error) {
    console.error("Error fetching current user", error);
    return null;
  }
}

export async function getUser(pb: PocketBase, userId: string) {
  try {
    const userData = await pb.collection("users").getOne<User>(userId, {
      expand: "relField1,relField2.subRelField",
    });
    return userData;
  } catch (error) {
    console.error("Error fetching user data", error);
    return null;
  }
}

export async function signInWithPassword(
  pb: PocketBase,
  email: string,
  password: string,
) {
  try {
    const authData = await pb.collection("users").authWithPassword(
      email,
      password,
    );
    return authData;
  } catch (error) {
    console.log("Error signing in user", error);
    return null;
  }
}

export function getAuthCookie(
  cookieStore: CookieStore,
) {
  const authCookie = cookieStore.get(PB_COOKIE_NAME);
  return authCookie?.value || null;
}

export function setAuthCookie(
  pb: PocketBase,
  cookieStore: CookieStore,
) {
  try {
    const authCookie = pb.authStore.exportToCookie({
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    const [_cookieName, cookieValue] = authCookie.split("=");
    cookieStore.set(PB_COOKIE_NAME, cookieValue);
  } catch (error) {
    console.log("Error signing in user", error);
    return null;
  }
}
