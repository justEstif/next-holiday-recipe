"use client";
import { signIn } from "@/actions";
import { useActionState } from "react";
import FormMessage from "./FormMessage";

const initialState = {
  message: "",
};

export default function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form action={formAction}>
      <input
        id="email"
        name="email"
        placeholder="Email"
        type="email"
        required
      />
      <input
        id="password"
        name="password"
        placeholder="Password"
        minLength={8}
        type="password"
        required
      />

      <FormMessage message={state?.message} />
      <button type="submit">Sign in</button>
    </form>
  );
}
