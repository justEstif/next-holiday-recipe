"use client";
import { useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import DynamicInput from "./DynamicInput";
import FormMessage from "./FormMessage";
import { IRecipe } from "@/types";
import { updateRecipe } from "@/actions";

export default function EditRecipeForm({ recipe }: { recipe: IRecipe }) {
	const [state, formAction, pending] = useActionState(updateRecipe, {
		message: "",
		status: undefined as "success" | "error" | undefined,
		id: undefined as string | undefined,
	});

	const [isPublished, setIsPublished] = useState(recipe.published);

	const handleFormAction = async (formData: FormData) => {
		const ingredientInputs = Array.from(formData.getAll("ingredients"));
		const stepInputs = Array.from(formData.getAll("steps"));
		const tagInputs = Array.from(formData.getAll("tags"));

		const ingredients = ingredientInputs.filter((val) => val !== "");
		const steps = stepInputs.filter((val) => val !== "");
		const tags = tagInputs.filter((val) => val !== "");

		const newFormData = new FormData();
		newFormData.set("title", formData.get("title") as string);
		newFormData.set("published", isPublished.toString());
		newFormData.set("ingredients", JSON.stringify(ingredients));
		newFormData.set("steps", JSON.stringify(steps));
		newFormData.set("tags", JSON.stringify(tags));
		newFormData.set("recipeId", recipe.id);
		const image = formData.get("image");
		if (image instanceof File && image.size > 0) {
			newFormData.set("image", image);
		}

		return formAction(newFormData);
	};

	useEffect(() => {
		if (!pending && state?.id) {
			redirect(`/recipes/${state.id}`);
		}
	}, [pending, state]);

	return (
		<form action={handleFormAction}>
			<label>
				Title
				<input
					id="recipeTitle"
					name="title"
					type="text"
					defaultValue={recipe.title}
				/>
			</label>

			<label>
				Image
				<input id="recipeImage" name="image" type="file" />
			</label>

			<DynamicInput
				name="ingredients"
				label="Ingredients"
				defaultValues={recipe.ingredients}
			/>

			<DynamicInput name="steps" label="Steps" defaultValues={recipe.steps} />

			<DynamicInput name="tags" label="Tags" defaultValues={recipe.tags} />

			<label>
				Publish Recipe{" "}
				<input
					id="published"
					name="published"
					type="checkbox"
					checked={isPublished}
					onChange={(e) => setIsPublished(e.target.checked)}
				/>
			</label>

			<FormMessage message={state?.message} />

			<button type="submit" aria-busy={pending} disabled={pending}>
				{pending
					? "Saving..."
					: isPublished
						? "Update & Publish Recipe"
						: "Update Recipe"}
			</button>
		</form>
	);
}
