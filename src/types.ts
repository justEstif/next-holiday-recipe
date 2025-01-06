import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { NextRequest, NextResponse } from "next/server";
import { RecordModel } from "pocketbase";

export interface IUser extends RecordModel {
	avatar: string;
	email: string;
	emailVisibility: boolean;
	name: string;
	username: string;
	verified: boolean;
}

export interface IRecipe extends RecordModel {
	created: string; // ISO date string
	updated: string; // ISO date string
	author: string;
	title: string;
	ingredients: string[]; // JSON string or object, depending on your handling
	steps: string[]; // JSON string or object, depending on your handling
	image?: string; // Filename or file path
	tags: string[]; // JSON string or object, depending on your handling
	published: boolean;
	expand?: {
		author?: IUser;
	};
}

export interface IUserCreate {
	email: string;
	password: string;
	passwordConfirm: string;
	emailVisibility?: boolean;
	username?: string;
	name?: string;
}

export type TCookieStore =
	| NextRequest["cookies"]
	| NextResponse["cookies"]
	| ReadonlyRequestCookies;
