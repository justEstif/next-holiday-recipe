"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
	createUser,
	getLoggedInUser,
	pbServer,
	setAuthCookie,
	signInWithPassword,
} from "./lib/server/pb";
import { cookies } from "next/headers";
import { ClientResponseError } from "pocketbase";

export async function signIn(
	_prevState: {
		message: string;
	},
	formData: FormData,
) {
	const schema = z.object({
		email: z
			.string({
				invalid_type_error: "Invalid Email",
			})
			.email(),
		password: z.string({
			invalid_type_error: "Invalid Password",
		}),
	});

	const validatedFields = schema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			message: "Failed to sign in",
		};
	}

	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);

	const authData = await signInWithPassword(
		pb,
		validatedFields.data.email,
		validatedFields.data.password,
	);
	if (authData) {
		setAuthCookie(pb, cookieStore);
		revalidatePath("/sign-in");
		return {
			message: "Signed in",
		};
	} else {
		return {
			message: "Failed to sign in",
		};
	}
}

export async function signUp(
	_prevState: {
		message: string;
	},
	formData: FormData,
) {
	const errorMessage = {
		message: "Failed to sign up",
	};

	const schema = z.object({
		name: z.string({
			invalid_type_error: "Invalid name",
		}),
		email: z
			.string({
				invalid_type_error: "Invalid Email",
			})
			.email(),
		password: z.string({
			invalid_type_error: "Invalid Password",
		}),
		passwordConfirm: z.string({
			invalid_type_error: "Invalid Password Confirm",
		}),
	});

	const validatedFields = schema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		passwordConfirm: formData.get("passwordConfirm"),
	});

	if (!validatedFields.success) {
		return errorMessage;
	}

	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);

	const user = await createUser(pb, {
		email: validatedFields.data.email,
		password: validatedFields.data.password,
		passwordConfirm: validatedFields.data.passwordConfirm,
	});

	if (!user) {
		return errorMessage;
	}
	const authData = await signInWithPassword(
		pb,
		validatedFields.data.email,
		validatedFields.data.password,
	);
	if (authData) {
		setAuthCookie(pb, cookieStore);
		return {
			message: "Signed in",
		};
	} else {
		return errorMessage;
	}
}

export async function createRecipe(
	_prevState: {
		message: string;
	},
	formData: FormData,
) {
	const errorMessage = {
		message: "Failed to create recipe",
	};

	const schema = z.object({
		title: z.string({
			invalid_type_error: "Invalid title",
		}),
		ingredients: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z.array(z.string()).parse(parsed);
			} catch {
				throw new Error("Invalid ingredients format");
			}
		}),
		steps: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z.array(z.string()).parse(parsed);
			} catch {
				throw new Error("Invalid steps format");
			}
		}),
		tags: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z.array(z.string()).parse(parsed);
			} catch {
				throw new Error("Invalid tags format");
			}
		}),
		image: z.instanceof(File).optional(),
	});

	try {
		const validatedFields = schema.safeParse({
			title: formData.get("title"),
			ingredients: formData.get("ingredients"),
			steps: formData.get("steps"),
			tags: formData.get("tags"),
			image: formData.get("image"),
		});

		if (!validatedFields.success) {
			return errorMessage;
		}

		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);
		const currentUser = getLoggedInUser(pb);

		// Create form data for PocketBase
		const pbFormData = new FormData();
		pbFormData.append("author", currentUser?.id ?? "");
		pbFormData.append("title", validatedFields.data.title);
		pbFormData.append(
			"ingredients",
			JSON.stringify(validatedFields.data.ingredients),
		);
		pbFormData.append("steps", JSON.stringify(validatedFields.data.steps));
		pbFormData.append("tags", JSON.stringify(validatedFields.data.tags));
		if (validatedFields.data.image) {
			pbFormData.append("image", validatedFields.data.image);
		}

		// Create record in PocketBase
		await pb.collection("recipes").create(pbFormData);

		revalidatePath("/recipes"); // Adjust this path as needed
		return {
			message: "Recipe created successfully",
		};
	} catch (error) {
		// const err = error as ClientResponseError;
		// console.error(err.toJSON());
		// console.error("Error creating recipe:", error);
		return errorMessage;
	}
}
