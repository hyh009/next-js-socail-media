import classes from "./sidebar.module.css";
import { forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  RiLogoutBoxRLine,
  RiAccountCircleLine,
  RiMessage2Line,
  RiHome4Line,
} from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { logoutUser } from "../../../utils/authUser";

const LinkText = forwardRef(({ onClick, href, text, Icon }, ref) => {
  return (
    <a
      className={`${classes[`link-text`]}`}
      href={href}
      onClick={onClick}
      ref={ref}
    >
      <Icon />
      <span className={classes.pcOnly}>{text}</span>
    </a>
  );
});

LinkText.displayName = "LinkText";

const Sidebar = ({ user }) => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  return (
    <ul className={classes.container}>
      <li className={`${classes.list} ${isActive("/") ? classes.active : ""}`}>
        <Link
          href={{
            pathname: "/",
          }}
          passHref
        >
          <LinkText Icon={RiHome4Line} text="Home" />
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive("/message") ? classes.active : ""
        }`}
      >
        <Link
          href={{
            pathname: "/",
          }}
          passHref
        >
          <LinkText Icon={RiMessage2Line} text="Message" />
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive("/notification") ? classes.active : ""
        }`}
      >
        <Link
          href={{
            pathname: "/",
          }}
          passHref
        >
          <LinkText Icon={MdNotificationsNone} text="Notifications" />
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive(`/${encodeURIComponent(user.username)}`)
            ? classes.active
            : ""
        }`}
      >
        <Link
          href={{
            pathname: "/",
          }}
          passHref
        >
          <LinkText Icon={RiAccountCircleLine} text="Account" />
        </Link>
      </li>
      <li
        className={`${classes.list}`}
        onClick={() => {
          logoutUser(user.email);
        }}
      >
        <span className={`${classes[`link-text`]}`}>
          <RiLogoutBoxRLine />
          <span className={classes.pcOnly}>Logout</span>
        </span>
      </li>
    </ul>
  );
};

export default Sidebar;
