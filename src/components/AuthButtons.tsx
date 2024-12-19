import { getLoggedInUser, pbServer } from "@/lib/server/pb";
import SignOut from "./SignOut";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function AuthButtons() {
  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);
  const currentUser = getLoggedInUser(pb);

  return (
    <>
      {currentUser
        ? (
          <ul>
            <li>
              <Link href="/recipes/new">New Recipes</Link>
            </li>
            <li>
              <Link href="/account">Account</Link>
            </li>
            <li>
              <SignOut />
            </li>
          </ul>
        )
        : (
          <ul>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
          </ul>
        )}
    </>
  );
}
