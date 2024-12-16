import { pbServer } from "@/lib/server/pb";
import { type Recipe } from "@/types";
import { cookies } from "next/headers";

async function getRecipe(recipeId: string) {
  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);

    const userData = await pb.collection("recipes").getOne<Recipe>(recipeId, {
      expand: "relField1,relField2.subRelField",
    });
    return userData;
  } catch (error) {
    console.error("Error getting recipe", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe = await getRecipe(recipeId);

  return (
    <section className="container">{recipe && <h1>{recipe.title}</h1>}</section>
  );
}
