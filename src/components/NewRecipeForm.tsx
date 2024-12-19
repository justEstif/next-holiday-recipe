"use client";
import { signIn } from "@/actions";
import { useActionState } from "react";
import FormMessage from "./FormMessage";

const initialState = {
  message: "",
};

export default function NewRecipeForm() {
  const [state, formAction] = useActionState(signIn, initialState);

  // TODO: Create dynamic input fields for the json objects
  return (
    <form action={formAction}>
      <label>
        Title
        <input
          id="recipeTitle"
          name="recipeTitle"
          type="text"
          required
        />
      </label>
      <label>
        Image
        <input
          type="file"
          id="recipeImage"
          name="recipeImage"
          required
        />
      </label>
      <label>
        Ingredients
        <input
          type="text"
          id="recipeIngredients"
          name="recipeIngredients"
          required
        />
      </label>
      <label>
        Steps
        <input
          type="text"
          id="recipeSteps"
          name="recipeSteps"
          required
        />
      </label>
      <label>
        Tags
        <input
          type="text"
          id="recipeTags"
          name="recipeTags"
          required
        />
      </label>
      <FormMessage message={state?.message} />
      <button type="submit">Preview Recipe</button>
    </form>
  );
}
