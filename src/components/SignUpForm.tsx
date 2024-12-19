"use client";
import { signUp } from "@/actions";
import { useActionState } from "react";
import FormMessage from "./FormMessage";

const initialState = {
  message: "",
};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <input
        id="name"
        name="name"
        placeholder="Full Name"
        type="text"
        required
      />
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
      <input
        id="passwordConfirm"
        name="passwordConfirm"
        placeholder="Confirm Password"
        minLength={8}
        type="password"
        required
      />
      <FormMessage message={state?.message} />
      <button type="submit">Sign up</button>
    </form>
  );
}
