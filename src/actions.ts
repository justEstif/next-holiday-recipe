"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { pbServer, setAuthCookie, signInWithPassword } from "./lib/server/pb";
import { cookies } from "next/headers";

export async function signIn(_prevState: {
  message: string;
}, formData: FormData) {
  const schema = z.object({
    email: z.string({
      invalid_type_error: "Invalid Email",
    }),
    password: z.string({
      invalid_type_error: "Invalid Password",
    }),
  });

  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Failed to sign in",
    };
  }

  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);

  const authData = await signInWithPassword(
    pb,
    validatedFields.data.email,
    validatedFields.data.password,
  );
  if (authData) {
    setAuthCookie(pb, cookieStore);
    revalidatePath("/sign-in");
    return {
      message: "Signed in",
    };
  } else {
    return {
      message: "Failed to sign in",
    };
  }
}
