"use client";
import usePocketbase from "@/hooks/usePocketbase";

const AuthButtons = () => {
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
    <>
      {user ? (
        <ul>
          <li>
            <button onClick={handleSignOut}>{user.username} - Sign Out</button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <button onClick={handleSignIn}>Sign In</button>
          </li>
        </ul>
      )}
    </>
  );
};

export default AuthButtons;
