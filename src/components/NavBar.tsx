"use client";
// show sign out and profile links if registered user
// show sign in button if visitor user

import { signIn } from "@/lib/pb";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <strong>Recipe</strong>
        </li>
      </ul>
      <ul>
        <li>
          <button onClick={signIn}>Sign In with GitHub</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
