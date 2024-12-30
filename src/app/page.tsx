import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import type { IRecipe } from "@/types";
import { getFormattedDate } from "@/utils";
import { cookies } from "next/headers";
import Image from "next/image";
import type Client from "pocketbase";
import { Fragment } from "react";

async function getPublishedRecipes(pb: Client) {
	try {
		const currentUser = getLoggedInUser(pb);
		const filter = currentUser?.id
			? `(published = true || author = "${currentUser.id}")`
			: "published = true";

		const recipes = await pb.collection("recipes").getList<IRecipe>(1, 50, {
			filter,
			expand: "author",
		});
		return recipes;
	} catch (error) {
		console.error("Error getting recipes", error);
		return null;
	}
}

function Recipe({ recipe, imageSrc }: { recipe: IRecipe; imageSrc?: string }) {
	return (
		<article>
			<header className="recipeCardHeader">
				<h3>
					<a href={`recipes/${recipe.id}`}>{recipe.title}</a>
				</h3>
				<div>
					<small>{getFormattedDate(recipe.updated)} </small>
					{!recipe.published && <mark>Draft</mark>}
				</div>
			</header>

			{recipe?.expand?.author?.username}

			{recipe?.image && imageSrc && (
				<Image
					src={imageSrc}
					alt={`${recipe.title} image`}
					width={300}
					height={300}
				/>
			)}
			<footer>
				{recipe.tags.map((tag, id) => (
					<Fragment key={id}>#{tag} </Fragment>
				))}
			</footer>
		</article>
	);
}

export default async function Home() {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);

	const recipes = await getPublishedRecipes(pb);

	return (
		<section className="container">
			<h1>Home Page</h1>
			{recipes?.items?.map((recipe) => (
				<Fragment key={recipe.id}>
					<Recipe
						recipe={recipe as IRecipe}
						imageSrc={pb.getFileUrl(recipe, recipe.image)}
					/>
				</Fragment>
			))}
		</section>
	);
}
