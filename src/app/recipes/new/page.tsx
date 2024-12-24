import NewRecipeForm from "@/components/NewRecipeForm";
import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);
	const currentUser = getLoggedInUser(pb);

	if (!currentUser) redirect("/sign-in");

	console.log(currentUser);

	return (
		<section className="container">
			<h1>New Recipe</h1>
			<NewRecipeForm />
		</section>
	);
}
