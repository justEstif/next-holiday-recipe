"use server";
import {
	createRecipeSchema,
	editAccountSchema,
	editRecipeSchema,
	signUpSchema,
} from "@/schemas";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import { z } from "zod";
import {
	createUser,
	getLoggedInUser,
	pbServer,
	setAuthCookie,
	signInWithPassword,
} from "./lib/server/pb";

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
	}
	return {
		message: "Failed to sign in",
	};
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

	const validatedFields = signUpSchema.safeParse({
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
		name: validatedFields.data.name,
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
	}
	return errorMessage;
}

export async function createRecipe(
	_prevState: {
		message: string;
		status?: "error" | "success";
		id?: string;
	},
	formData: FormData,
) {
	try {
		const validatedFields = createRecipeSchema.safeParse({
			title: formData.get("title"),
			ingredients: formData.get("ingredients"),
			steps: formData.get("steps"),
			tags: formData.get("tags"),
			image: formData.get("image"),
			published: formData.get("published"),
		});

		if (!validatedFields.success) {
			const errorMessages = validatedFields.error.issues
				.map((issue) => issue.message)
				.join(". ");
			return {
				message: errorMessages,
				status: "error" as const,
				id: undefined,
			};
		}

		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);
		const currentUser = getLoggedInUser(pb);

		if (!currentUser?.id) {
			return {
				message: "You must be logged in to create a recipe",
				status: "error" as const,
				id: undefined,
			};
		}

		const pbFormData = new FormData();
		pbFormData.append("author", currentUser.id);
		pbFormData.append("title", validatedFields.data.title);
		pbFormData.append("published", validatedFields.data.published);
		pbFormData.append(
			"ingredients",
			JSON.stringify(validatedFields.data.ingredients),
		);
		pbFormData.append("steps", JSON.stringify(validatedFields.data.steps));
		pbFormData.append("tags", JSON.stringify(validatedFields.data.tags));
		if (validatedFields.data.image) {
			pbFormData.append("image", validatedFields.data.image);
		}

		const newRecipe = await pb.collection("recipes").create(pbFormData);

		revalidatePath("/");
		redirect(`/recipes/${newRecipe.id}`);
	} catch (error) {
		if (error instanceof ClientResponseError) {
			// Handle specific PocketBase errors
			if (error.status === 400) {
				return {
					message: "Invalid recipe data. Please check your inputs.",
					status: "error" as const,
					id: undefined,
				};
			}
			if (error.status === 401 || error.status === 403) {
				return {
					message: "You don't have permission to create recipes.",
					status: "error" as const,
					id: undefined,
				};
			}
			return {
				message: `Database error: ${error.message}`,
				status: "error" as const,
				id: undefined,
			};
		}
		if (isRedirectError(error)) {
			throw error;
		}

		console.error("Error creating recipe:", error);
		return {
			message: "An unexpected error occurred. Please try again later.",
			status: "error" as const,
			id: undefined,
		};
	}
}

export async function updateRecipe(
	_prevState: {
		message: string;
		status?: "error" | "success";
		id?: string;
	},
	formData: FormData,
) {
	try {
		const recipeId = formData.get("recipeId") as string;
		if (!recipeId) {
			return {
				message: "Missing recipe ID in form data",
				status: "error" as const,
				id: undefined,
			};
		}
		const validatedFields = editRecipeSchema.safeParse({
			title: formData.get("title"),
			ingredients: formData.get("ingredients"),
			steps: formData.get("steps"),
			tags: formData.get("tags"),
			image:
				formData.get("image") instanceof File ? formData.get("image") : null,
			published: formData.get("published"),
		});

		if (!validatedFields.success) {
			const errorMessages = validatedFields.error.issues
				.map((issue) => issue.message)
				.join(". ");
			return {
				message: errorMessages,
				status: "error" as const,
				id: undefined,
			};
		}
		const cookieStore = await cookies();
		const pb = await pbServer(cookieStore);
		const currentUser = getLoggedInUser(pb);

		if (!currentUser?.id) {
			return {
				message: "You must be logged in to update a recipe",
				status: "error" as const,
				id: undefined,
			};
		}

		const existingRecipe = await pb.collection("recipes").getOne(recipeId);

		if (existingRecipe.author !== currentUser.id) {
			return {
				message: "You can only edit your own recipes",
				status: "error" as const,
				id: undefined,
			};
		}

		const pbFormData = new FormData();
		pbFormData.append("title", validatedFields.data.title);
		pbFormData.append("published", validatedFields.data.published);
		pbFormData.append(
			"ingredients",
			JSON.stringify(validatedFields.data.ingredients),
		);
		pbFormData.append("steps", JSON.stringify(validatedFields.data.steps));
		pbFormData.append("tags", JSON.stringify(validatedFields.data.tags));

		if (validatedFields.data.image) {
			pbFormData.append("image", validatedFields.data.image);
		}

		await pb.collection("recipes").update(recipeId, pbFormData);

		revalidatePath("/");
		revalidatePath(`/recipes/${recipeId}`);
		redirect(`/recipes/${recipeId}`);
	} catch (error) {
		if (error instanceof ClientResponseError) {
			if (error.status === 400) {
				return {
					message: "Invalid recipe data. Please check your inputs.",
					status: "error" as const,
					id: undefined,
				};
			}
			if (error.status === 401 || error.status === 403) {
				return {
					message: "You don't have permission to update this recipe.",
					status: "error" as const,
					id: undefined,
				};
			}
			return {
				message: `Database error: ${error.message}`,
				status: "error" as const,
				id: undefined,
			};
		}
		if (isRedirectError(error)) {
			throw error;
		}
		console.error("Error updating recipe:", error);
		return {
			message: "An unexpected error occurred. Please try again later.",
			status: "error" as const,
			id: undefined,
		};
	}
}

export async function updateUser(
	_prevState: {
		message: string;
		status?: "error" | "success";
		id?: string;
	},
	formData: FormData,
) {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);
	const currentUser = getLoggedInUser(pb);
	if (!currentUser?.id) {
		return {
			message: "You must be logged in to update a recipe",
			status: "error" as const,
			id: undefined,
		};
	}

	// get the form data and validate it
	const validatedFields = editAccountSchema.safeParse({
		name: formData.get("name"),
		username: formData.get("username"),
		email: formData.get("email"),
		oldPassword: formData.get("oldPassword"),
		password: formData.get("newPassword"),
		passwordConfirm: formData.get("newPasswordConfirm"),
		avatar:
			formData.get("avatar") instanceof File ? formData.get("avatar") : null,
	});

	if (!validatedFields.success) {
		const errorMessages = validatedFields.error.issues
			.map((issue) => issue.message)
			.join(". ");
		return {
			message: errorMessages,
			status: "error" as const,
			id: undefined,
		};
	}

	const data = {
		username: validatedFields.data?.username,
		avatar: validatedFields.data?.avatar,
		password: validatedFields.data?.password,
		passwordConfirm: validatedFields.data?.passwordConfirm,
		oldPassword: validatedFields.data?.oldPassword,
		name: validatedFields.data?.name,
	};

	const record = await pb.collection("users").update(currentUser.id, data);
}
