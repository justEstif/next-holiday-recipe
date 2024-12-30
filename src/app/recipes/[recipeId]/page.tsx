import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import type { IRecipe } from "@/types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type Client from "pocketbase";

async function getRecipe(pb: Client, recipeId: string) {
	try {
		const recipe = await pb.collection("recipes").getOne<IRecipe>(recipeId, {
			expand: "author",
		});
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
	const recipe = await getRecipe(pb, recipeId);
	if (!recipe) {
		notFound();
	}
	const currentUser = getLoggedInUser(pb);

	return (
		<section className="container">
			<hgroup>
				<h1>{recipe.title}</h1>
				<p>{recipe.expand?.author?.username}</p>
			</hgroup>

			<section>
				{recipe.tags.map((tag, id) => (
					<span key={id}>#{tag} </span>
				))}
			</section>

			<section>
				{currentUser && currentUser.id === recipe.author && (
					<Link href={`/recipes/${recipeId}/edit`}>
						Edit <sup>🖉</sup>
					</Link>
				)}
			</section>

			{recipe?.image && (
				<Image
					src={pb.files.getURL(recipe, recipe.image)}
					alt={`${recipe.title} image`}
					width={300}
					height={300}
				/>
			)}

			<h2>Ingredients</h2>
			<ul>
				{recipe.ingredients.map((ingredient, id) => (
					<li key={id}>{ingredient}</li>
				))}
			</ul>

			<h2>Steps</h2>
			<ol>
				{recipe.steps.map((step, id) => (
					<li key={id}>{step}</li>
				))}
			</ol>
		</section>
	);
}
