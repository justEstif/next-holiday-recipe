import { pbServer } from "@/lib/server/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signInWithGitHub() {
  "use server";

  try {
    const pb = await pbServer();
    const authData = await pb
      .collection("users")
      .authWithOAuth2({ provider: "github" });
    const authCookie = pb.authStore.exportToCookie({
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    const [_cookieName, cookieValue] = authCookie.split("=");
    (await cookies()).set("pb_auth", cookieValue);

    // update the user avatar
    const meta = authData.meta || {};
    if (meta.isNew) {
      const formData = new FormData();
      const response = await fetch(meta.avatarUrl);
      if (response.ok) {
        const file = await response.blob();
        formData.append("avatar", file);
      }

      formData.append("name", meta.name);
      await pb.collection("users").update(authData.record.id, formData);
      redirect("/account");
    }

    redirect("/");
  } catch (error) {
    console.error("Failed to sign in:", error);
    throw error;
  }
}

export default async function SignIn() {
  return (
    <form action={signInWithGitHub}>
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
