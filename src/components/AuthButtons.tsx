import { getLoggedInUser } from "@/lib/server/pb";
import SignOut from "./SignOut";
import SignIn from "./SignIn";

export default async function AuthButtons() {
  const currentUser = await getLoggedInUser();

  return (
    <>
      {currentUser ? (
        <ul>
          <li>
            <SignOut />
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <SignIn />
          </li>
        </ul>
      )}
    </>
  );
}
