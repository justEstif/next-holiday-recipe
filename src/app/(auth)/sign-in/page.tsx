import SignInForm from "@/components/SignInForm";
import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignInPage() {
	const cookieStore = await cookies();
	const pb = await pbServer(cookieStore);
	const currentUser = getLoggedInUser(pb);

	if (currentUser) {
		redirect("/");
	}

	return (
		<section>
			<h1>Sign in</h1>
			<SignInForm />
			Don't have an account? <Link href="/sign-up">Sign up</Link>
		</section>
	);
}
