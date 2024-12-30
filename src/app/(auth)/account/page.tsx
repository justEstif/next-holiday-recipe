import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import Link from "next/link";
import { unauthorized } from "next/navigation";

export default async function AccountPage() {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);
	const currentUser = getLoggedInUser(pb);

	if (!currentUser) {
		unauthorized();
	}

	return (
		<section>
			<h1>Account</h1>
			<p>Username: {currentUser?.username}</p>
			<p>Email: {currentUser?.email}</p>
			<p>Avatar: {currentUser?.avatar || "avatar"}</p>
			<Link href="/account/edit">Edit</Link>
		</section>
	);
}
