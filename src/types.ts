import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest, NextResponse } from "next/server";

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

// TODO: improve the routes here
export interface Recipe {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string; // ISO date string
	updated: string; // ISO date string
	authorId: string;
	title: string;
	ingredients: string[]; // JSON string or object, depending on your handling
	steps: string[]; // JSON string or object, depending on your handling
	image: string; // Filename or file path
	tags: string[]; // JSON string or object, depending on your handling
	published: boolean;
	expand?: {
		author?: User;
	};
}

export interface UserCreate {
	email: string;
	password: string;
	passwordConfirm: string;
	emailVisibility?: boolean;
	username?: string;
	name?: string;
}

export type CookieStore =
	| NextRequest["cookies"]
	| NextResponse["cookies"]
	| ReadonlyRequestCookies;
