import { useRouter } from "next/router";
import Link from "next/link";
import classes from "./Navbar.module.css";
import { AiOutlineLogin } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";

const Navbar = ({ errorPage }) => {
  const router = useRouter();
  const checkIfActive = (route) => route === router.pathname;
  return (
    <div className={classes.container}>
      <Link href="/" passHref>
        <div className={classes.title}>Mini Social Media</div>
      </Link>
      {!errorPage && (
        <div className={classes.menu}>
          <Link href="/login" passHref>
            <div
              className={`${classes[`menu-item`]} ${
                checkIfActive("/login") ? classes[`menu-active`] : ""
              }`}
            >
              <AiOutlineLogin />
              Login
            </div>
          </Link>
          <Link href="/signup" passHref>
            <div
              className={`${classes[`menu-item`]} ${
                checkIfActive("/signup") ? classes[`menu-active`] : ""
              }`}
            >
              <BsPencilSquare />
              Signup
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
