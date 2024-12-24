import SignUpForm from "@/components/SignUpForm";
import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);
  const currentUser = getLoggedInUser(pb);

  if (currentUser) {
    redirect("/account");
  }

  // TODO: add form state
  // TODO: redirect if user is logged in

  return (
    <section>
      <h1>Sign up</h1>
      <SignUpForm />
      Already have an account? <Link href="/sign-in">Sign in</Link>
    </section>
  );
}
