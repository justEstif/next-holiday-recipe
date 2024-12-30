"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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
	const schema = z.object({
		title: z
			.string({
				required_error: "Title is required",
				invalid_type_error: "Title must be text",
			})
			.min(1, "Title cannot be empty"),
		ingredients: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z
					.array(z.string().min(1, "Ingredient cannot be empty"))
					.min(1, "At least one ingredient is required")
					.parse(parsed);
			} catch {
				throw new Error("Invalid ingredients format - please check your input");
			}
		}),
		steps: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z
					.array(z.string().min(1, "Step cannot be empty"))
					.min(1, "At least one step is required")
					.parse(parsed);
			} catch {
				throw new Error("Invalid steps format - please check your input");
			}
		}),
		tags: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z.array(z.string().min(1, "Tag cannot be empty")).parse(parsed);
			} catch {
				throw new Error("Invalid tags format - please check your input");
			}
		}),
		published: z.preprocess(
			(val) => val === "true" || val === true,
			z.boolean(),
		),
		image: z.instanceof(File).optional(),
	});

	try {
		const validatedFields = schema.safeParse({
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

		return {
			message: validatedFields.data.published
				? "Recipe published successfully! 🎉"
				: "Recipe saved as draft successfully! 📝",
			status: "success" as const,
			id: newRecipe.id,
		};
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
	const schema = z.object({
		title: z
			.string({
				required_error: "Title is required",
				invalid_type_error: "Title must be text",
			})
			.min(1, "Title cannot be empty"),
		ingredients: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z
					.array(z.string().min(1, "Ingredient cannot be empty"))
					.min(1, "At least one ingredient is required")
					.parse(parsed);
			} catch {
				throw new Error("Invalid ingredients format - please check your input");
			}
		}),
		steps: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z
					.array(z.string().min(1, "Step cannot be empty"))
					.min(1, "At least one step is required")
					.parse(parsed);
			} catch {
				throw new Error("Invalid steps format - please check your input");
			}
		}),
		tags: z.string().transform((str) => {
			try {
				const parsed = JSON.parse(str);
				return z.array(z.string().min(1, "Tag cannot be empty")).parse(parsed);
			} catch {
				throw new Error("Invalid tags format - please check your input");
			}
		}),
		published: z.preprocess(
			(val) => val === "true" || val === true,
			z.boolean(),
		),
		image: z.union([z.instanceof(File), z.null(), z.undefined()]),
	});

	try {
		const recipeId = formData.get("recipeId") as string;
		if (!recipeId) {
			return {
				message: "Missing recipe ID in form data",
				status: "error" as const,
				id: undefined,
			};
		}
		const validatedFields = schema.safeParse({
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

		const updatedRecipe = await pb
			.collection("recipes")
			.update(recipeId, pbFormData);
		revalidatePath("/");
		revalidatePath(`/recipes/${recipeId}`);

		return {
			message: validatedFields.data.published
				? "Recipe updated and published successfully! 🎉"
				: "Recipe updated successfully! 📝",
			status: "success" as const,
			id: updatedRecipe.id,
		};
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
		console.error("Error updating recipe:", error);
		return {
			message: "An unexpected error occurred. Please try again later.",
			status: "error" as const,
			id: undefined,
		};
	}
}
