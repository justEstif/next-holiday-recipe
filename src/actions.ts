"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  createUser,
  pbServer,
  setAuthCookie,
  signInWithPassword,
} from "./lib/server/pb";
import { cookies } from "next/headers";

export async function signIn(_prevState: {
  message: string;
}, formData: FormData) {
  const schema = z.object({
    email: z.string({
      invalid_type_error: "Invalid Email",
    }).email(),
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

export async function signUp(_prevState: {
  message: string;
}, formData: FormData) {
  const errorMessage = {
    message: "Failed to sign up",
  };

  const schema = z.object({
    name: z.string({
      invalid_type_error: "Invalid name",
    }),
    email: z.string({
      invalid_type_error: "Invalid Email",
    }).email(),
    password: z.string({
      invalid_type_error: "Invalid Password",
    }),
    passwordConfirm: z.string({
      invalid_type_error: "Invalid Password Confirm",
    }),
  });

  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!validatedFields.success) {
    return errorMessage;
  }

  const cookieStore = await cookies();
  const pb = await pbServer(cookieStore);

  const user = await createUser(pb, {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    passwordConfirm: validatedFields.data.passwordConfirm,
  });

  if (!user) {
    return errorMessage;
  }
  const authData = await signInWithPassword(
    pb,
    validatedFields.data.email,
    validatedFields.data.password,
  );
  if (authData) {
    setAuthCookie(pb, cookieStore);
    return {
      message: "Signed in",
    };
  } else {
    return errorMessage;
  }
}

export async function createRecipe(_prevState: {
  message: string;
}, formData: FormData) {
  const errorMessage = {
    message: "Failed to create recipe",
  };

  console.log(formData);
  return errorMessage;
}
