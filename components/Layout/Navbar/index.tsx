import { useRouter } from "next/router";
import Link from "next/link";
import classes from "./Navbar.module.css";
import { AiOutlineLogin } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";

interface Props {
  errorPage?:boolean
}

const Navbar:React.FC<Props> = ({ errorPage }) => {
  const router = useRouter();
  const checkIfActive = (route:"/"|"/login"|"/signup"):boolean => route === router.pathname;
  return (
    <div className={classes.container}>
      <Link href="/" passHref>
        <a className={classes.title}>Mini Social Media</a>
      </Link>
      {!errorPage && (
        <div className={classes.menu}>
          <Link href="/login" passHref>
            <a
              className={`${classes[`menu-item`]} ${
                checkIfActive("/login") ? classes[`menu-active`] : ""
              }`}
            >
              <AiOutlineLogin />
              Login
            </a>
          </Link>
          <Link href="/signup" passHref>
            <a
              className={`${classes[`menu-item`]} ${
                checkIfActive("/signup") ? classes[`menu-active`] : ""
              }`}
            >
              <BsPencilSquare />
              Signup
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
