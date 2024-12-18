"use client";
import { signUp } from "@/actions";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function SignUpForm() {
  const [_state, formAction] = useActionState(signUp, initialState);
  // TODO: add form state
console.log(_state)
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
      <button type="submit">Sign up</button>
    </form>
  );
}
