import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import type { IRecipe } from "@/types";
import { cookies } from "next/headers";
import { forbidden, notFound, unauthorized } from "next/navigation";
import type Client from "pocketbase";
import EditRecipeForm from "@/components/EditRecipeForm";

async function getRecipe(pb: Client, recipeId: string) {
	try {
		const recipe = await pb.collection("recipes").getOne<IRecipe>(recipeId);
		return recipe;
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
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);

	const currentUser = getLoggedInUser(pb);
	if (!currentUser) {
		unauthorized();
	}

	const recipe = await getRecipe(pb, recipeId);
	if (!recipe) {
		notFound();
	}

	if (recipe.author !== currentUser?.id) {
		forbidden();
	}

	return (
		<section className="container">
			<h1>Edit Recipe</h1>
			<EditRecipeForm recipe={recipe} />
		</section>
	);
}
