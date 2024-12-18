import SignInForm from "@/components/SignInForm";
import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);
  const currentUser = getLoggedInUser(pb);

  if (currentUser) {
    redirect("/");
  }

  // TODO: add form state
  // TODO: redirect if user is logged in

  return (
    <section>
      <h1>Sign in</h1>
      <SignInForm />
      New?{" "}<Link href="/sign-up">Sign up</Link>
    </section>
  );
}
