import PocketBase from "pocketbase";
import { NextRequest } from "next/server";

export const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
export const PB_COOKIE_NAME = "pb_auth";

export async function pbServer(request: NextRequest) {
  const pb = new PocketBase(PB_URL);

  // Load the store data from the request cookie string
  const authCookie = request.cookies.get(PB_COOKIE_NAME);
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

export const signIn = async () => {
  try {
    const pb = new PocketBase(PB_URL);
    const authData = await pb
      .collection("users")
      .authWithOAuth2({ provider: "github" });

    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    console.log(document.cookie);
    console.log("auth success = ", authData);
    return authData;
    // TODO
    // cookies().set("pocketbase_auth", pb.authStore.exportToCookie());
    // document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  } catch (error) {
    throw error;
  }
};