import Link from "next/link";
import AuthButtons from "./AuthButtons";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <strong>
            <Link href="/">Recipe App</Link>
          </strong>
        </li>
      </ul>
      <AuthButtons />
    </nav>
  );
};

export default NavBar;
