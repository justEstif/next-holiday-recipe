import { z } from "zod";

export const signUpSchema = z.object({
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

export const editRecipeSchema = z.object({
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
	published: z.preprocess((val) => val === "true" || val === true, z.boolean()),
	image: z.union([z.instanceof(File), z.null(), z.undefined()]),
});

export const createRecipeSchema = z.object({
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
	published: z.preprocess((val) => val === "true" || val === true, z.boolean()),
	image: z.union([z.instanceof(File), z.null(), z.undefined()]),
});

export const editAccountSchema = z
	.object({
		name: z
			.string({
				invalid_type_error: "Invalid name",
			})
			.optional(),
		username: z
			.string({
				invalid_type_error: "Invalid username",
			})
			.optional(),
		email: z
			.string({
				invalid_type_error: "Invalid Email",
			})
			.email()
			.optional(),
		oldPassword: z
			.string({
				invalid_type_error: "Invalid Current Password",
			})
			.optional(),
		password: z
			.string({
				invalid_type_error: "Invalid New Password",
			})
			.optional(),
		passwordConfirm: z
			.string({
				invalid_type_error: "Invalid Password Confirm",
			})
			.optional(),
		avatar: z.union([z.instanceof(File), z.null(), z.undefined()]),
	})
	.refine(
		(data) => {
			// If any password field has a value, all must have values
			if (data.oldPassword || data.password || data.passwordConfirm) {
				return !!data.oldPassword && !!data.password && !!data.passwordConfirm;
			}
			// If all are empty/undefined, that's fine
			return true;
		},
		{
			message: "All password fields must be filled if any are provided",
			path: ["passwordConfirm"], // Show error on the confirm password field
		},
	);
