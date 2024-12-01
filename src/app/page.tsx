import { pbServer, Recipe } from "@/lib/pb";
import { sliceArrayIntoBatches } from "@/utils";
import { cookies } from "next/headers";

async function getRecipes() {
  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);
    const recipes = await pb.collection("recipes").getList<Recipe>(1, 50);
    return recipes;
  } catch (error) {
    console.error("Error getting recipes", error);
    return null;
  }
}

export default async function Home() {
  const recipes = await getRecipes();
  const batchedRecipes = sliceArrayIntoBatches(recipes?.items || [], 3);

  return (
    <section className="container">
      <h1>Home Page</h1>
      {batchedRecipes.map((batch, batchIndex) => (
        <>
          {batch.map((recipe, recipeIndex) => (
            <div className="grid">
              <article key={recipeIndex}>
                <h3>{recipe.title}</h3>
              </article>
            </div>
          ))}
        </>
      ))}
    </section>
  );
}
