import { z } from "zod";

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
