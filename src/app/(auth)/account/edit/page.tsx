import EditUserForm from "@/components/EditUserForm";
import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { IUser } from "@/types";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

export default async function EditAccountPage() {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);
	const currentUser = getLoggedInUser(pb);
	if (!currentUser) {
		unauthorized();
	}

	console.log(currentUser);
	// Get the current user
	// Add it to EditForm
	// Create an edit account action
	// Add submit button
	return (
		<section className="container">
			<h1>Edit Account</h1>
			<EditUserForm user={currentUser as IUser} />
		</section>
	);
}
