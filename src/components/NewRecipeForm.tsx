"use client";
import { createRecipe } from "@/actions";
import { useActionState } from "react";
import FormMessage from "./FormMessage";
import DynamicInput from "./DynamicInput";

export default function NewRecipeForm() {
	const [state, formAction] = useActionState(createRecipe, { message: "" });

	// Create a wrapper for the form action to transform the data
	const handleFormAction = async (formData: FormData) => {
		// Get all inputs for each field type
		const ingredientInputs = Array.from(formData.getAll("ingredients"));
		const stepInputs = Array.from(formData.getAll("steps"));
		const tagInputs = Array.from(formData.getAll("tags"));

		// Filter out empty values
		const ingredients = ingredientInputs.filter((val) => val !== "");
		const steps = stepInputs.filter((val) => val !== "");
		const tags = tagInputs.filter((val) => val !== "");

		// Create new FormData with arrays
		const newFormData = new FormData();
		newFormData.set("title", formData.get("title") as string);
		newFormData.set("image", formData.get("image") as File);

		// Set arrays in FormData
		newFormData.set("ingredients", JSON.stringify(ingredients));
		newFormData.set("steps", JSON.stringify(steps));
		newFormData.set("tags", JSON.stringify(tags));

		return formAction(newFormData);
	};

	return (
		<form action={handleFormAction}>
			<label>
				Title
				<input id="recipeTitle" name="title" type="text" required />
			</label>
			<label>
				Image
				<input type="file" id="recipeImage" name="image" />
			</label>

			<DynamicInput name="ingredients" label="Ingredients" />
			<DynamicInput name="steps" label="Steps" />
			<DynamicInput name="tags" label="Tags" />

			<FormMessage message={state?.message} />
			<button type="submit">Preview Recipe</button>
		</form>
	);
}
