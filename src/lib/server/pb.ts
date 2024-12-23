import PocketBase, { ClientResponseError } from "pocketbase";
import { CookieStore, User, UserCreate } from "@/types";

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
    const err = error as ClientResponseError;
    console.error("Auth refresh failed:", err.toJSON());
    pb.authStore.clear();
  }

  return pb;
}

export function getLoggedInUser(pb: PocketBase) {
  try {
    const currentUser = pb.authStore.model;
    return currentUser;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Error fetching current user", err.toJSON());
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
    const err = error as ClientResponseError;
    console.error("Error fetching user data", err.toJSON());
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
    const err = error as ClientResponseError;
    console.error("Error signing in user", err.toJSON());
    return null;
  }
}

export async function createUser(
  pb: PocketBase,
  userData: UserCreate,
) {
  try {
    const user = await pb.collection("users").create<User>(userData);
    return user;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Error creating user", err.toJSON());
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
    const authCookie = pb.authStore.exportToCookie();
    const [_cookieName, cookieValue] = authCookie.split("=");
    cookieStore.set(PB_COOKIE_NAME, cookieValue, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Error setting auth cookie", err.toJSON());
    return null;
  }
}
