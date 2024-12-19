"use client";
import { createRecipe } from "@/actions";
import { ChangeEvent, useActionState, useState } from "react";
import FormMessage from "./FormMessage";

type DynamicInputProps = {
  name: string;
  label: string;
};

function DynamicInput({ name, label }: DynamicInputProps) {
  // Always start with one empty field
  const [fields, setFields] = useState<string[]>([""]);

  const handleFieldChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newFields = [...fields];
    newFields[index] = event.target.value;
    setFields(newFields);
  };

  const addField = () => {
    // Check if the last field is not empty before adding a new field
    if (fields[fields.length - 1].trim() !== "") {
      setFields([...fields, ""]);
    } else {
      alert("Please fill out the previous field before adding a new one.");
    }
  };

  return (
    <fieldset>
      <legend>{label}</legend>
      {fields.map((value, index) => (
        <div key={index}>
          <input
            type="text"
            name={`${name}[${index + 1}]`}
            value={value}
            onChange={(e) => handleFieldChange(index, e)}
            required={index === 0}
          />
        </div>
      ))}
      <button type="button" onClick={addField}>Add {label}</button>
    </fieldset>
  );
}

export default function NewRecipeForm() {
  const [state, formAction] = useActionState(createRecipe, { message: "" });
  console.log(state);
  return (
    <form action={formAction}>
      <label>
        Title
        <input
          id="recipeTitle"
          name="title"
          type="text"
          required
        />
      </label>
      <label>
        Image
        <input
          type="file"
          id="recipeImage"
          name="image"
        />
      </label>

      {/* Ingredients - start with one empty field */}
      <DynamicInput name="ingredients" label="Ingredients" />

      {/* Steps - start with one empty field */}
      <DynamicInput name="steps" label="Steps" />

      {/* Tags - now also start with one empty field */}
      <DynamicInput name="tags" label="Tags" />

      <FormMessage message={state?.message} />
      <button type="submit">Preview Recipe</button>
    </form>
  );
}
