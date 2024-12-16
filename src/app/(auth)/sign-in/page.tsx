"use client";
import { signIn } from "@/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
};

export default async function SignUpPage() {
  const [state, formAction] = useFormState(signIn, initialState);


  return (
    <section>
      <h1>Sign in</h1>
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
    </section>
  );
}
