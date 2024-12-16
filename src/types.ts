import { NextRequest, NextResponse } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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

export type CookieStore =
  | NextRequest["cookies"]
  | NextResponse["cookies"]
  | ReadonlyRequestCookies;
