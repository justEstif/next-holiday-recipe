import { NextRequest } from "next/server";
import PocketBase from "pocketbase";

// TODO think about how we plan on init pb
// Sometimes I only want the user
export async function initPocketBase(req: NextRequest) {
  const pb = new PocketBase("http://127.0.0.1:8090");

  // load the store data from the request cookie string
  const authCookie = req.cookies.get("pb_auth")?.value || "";
  pb.authStore.loadFromCookie(authCookie);

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  const authCookieString = pb.authStore.exportToCookie();

  return { pb, authCookieString };
}
