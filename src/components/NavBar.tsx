"use client";
import usePocketbase from "@/hooks/usePocketbase";

const NavBar = () => {
  const { user, signIn, signOut } = usePocketbase();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      // Handle sign-in error
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav>
      <ul>
        <li>
          <strong>Recipe App</strong>
        </li>
      </ul>
      <ul></ul>
      {user ? (
        <>
          <li>
            <button onClick={handleSignOut}>{user.username} - Sign Out</button>
          </li>
        </>
      ) : (
        <li>
          <button onClick={handleSignIn}>Sign In</button>
        </li>
      )}
    </nav>
  );
};

export default NavBar;
