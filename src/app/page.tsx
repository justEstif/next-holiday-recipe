import { pbServer, Recipe } from "@/lib/pb";
import Image from "next/image";
import { sliceArrayIntoBatches } from "@/utils";
import { cookies } from "next/headers";
import Client from "pocketbase";

async function getRecipes(pb: Client) {
  try {
    const recipes = await pb.collection("recipes").getList<Recipe>(1, 50);
    return recipes;
  } catch (error) {
    console.error("Error getting recipes", error);
    return null;
  }
}

function getRecipeImageUrl(pb: Client, recipe: Recipe): string {
  return pb.getFileUrl(recipe, recipe.image);
}

export default async function Home() {
  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);

  const recipes = await getRecipes(pb);
  const batchedRecipes = sliceArrayIntoBatches(recipes?.items || [], 3);

  return (
    <section className="container">
      <h1>Home Page</h1>
      {batchedRecipes.map((batch, batchIndex) => (
        <div key={batchIndex} className="grid">
          {batch.map((recipe) => (
            <div key={recipe.id}>
              <h3>
                <a href={`recipes/${recipe.id}`}>{recipe.title}</a>
              </h3>
              <Image
                src={getRecipeImageUrl(pb, recipe)}
                alt={`${recipe.title} image`}
                width={300}
                height={300}
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
