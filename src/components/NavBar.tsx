"use client";

import { getUser, signIn, signOut } from "@/lib/pb";

const NavBar = () => {
  const user = getUser();
  console.log(user);
  return (
    <nav>
      <ul>
        <li>
          <strong>Recipe</strong>
        </li>
      </ul>
      <ul>
        {user ? (
          <li>
            <button onClick={signOut}>Sign Out</button>
          </li>
        ) : (
          <li>
            <button onClick={signIn}>Sign In with GitHub</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

// show sign out and profile links if registered user
// show sign in button if visitor user
