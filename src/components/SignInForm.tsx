"use client";
import { signIn } from "@/actions";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function SignInForm() {
  const [_state, formAction] = useActionState(signIn, initialState);
  // TODO: add form state

  return (
    <form action={formAction}>
      <input
        id="email"
        name="email"
        placeholder="Email"
        type="email"
      />
      <input
        id="password"
        name="password"
        placeholder="Password"
        minLength={8}
        type="password"
      />
      <button type="submit">Sign in</button>
    </form>
  );
}
