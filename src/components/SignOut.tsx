import { getLoggedInUser, PB_COOKIE_NAME, pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signOut() {
  "use server";

  try {
    const cookieStore = await cookies();
    const pb = await pbServer(cookieStore);
    (await cookies()).delete(PB_COOKIE_NAME);
    pb.authStore.clear();
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw error;
  }
}

export default async function SignOut() {
  return (
    <form action={signOut}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
