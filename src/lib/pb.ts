import PocketBase from "pocketbase";
import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const PB_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";
export const PB_COOKIE_NAME = "pb_auth";

export async function pbServer(
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies,
) {
  const pb = new PocketBase(PB_URL);
  // Load the store data from the request cookie string
  const authCookie = cookies.get(PB_COOKIE_NAME);
  if (authCookie) {
    pb.authStore.loadFromCookie(`${PB_COOKIE_NAME}=${authCookie.value}`);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch (error) {
    console.error("Auth refresh failed:", error);
    cookies.delete(PB_COOKIE_NAME);
    pb.authStore.clear();
  }

  return pb;
}

export interface User {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: Date; // Using Date type
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: Date; // Using Date type
  username: string;
  verified: boolean;
}

export type Recipe = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string; // ISO date string
  updated: string; // ISO date string
  authorId: string;
  title: string;
  ingredients: string; // JSON string or object, depending on your handling
  steps: string; // JSON string or object, depending on your handling
  image: string; // Filename or file path
  tags: string; // JSON string or object, depending on your handling
};
