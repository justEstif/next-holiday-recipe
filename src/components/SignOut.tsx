import { pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";

async function signOut() {
  "use server";

  try {
    const pb = await pbServer();
    (await cookies()).delete("pb_auth");
    pb.authStore.clear();
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw error;
  }
}

export default function SignOut() {
  return (
    <form action={signOut}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
