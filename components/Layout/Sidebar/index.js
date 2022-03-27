import classes from "./sidebar.module.css";
import React from "react";
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
        >
          <a className={`${classes[`link-text`]}`}>
            <RiHome4Line />
            <span className={classes.pcOnly}>Home</span>
          </a>
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive("/message") ? classes.active : ""
        }`}
      >
        <Link
          href={{
            pathname: "/message",
          }}
        >
          <a className={`${classes[`link-text`]}`}>
            <RiMessage2Line />
            <span className={classes.pcOnly}>Message</span>
          </a>
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive("/notification") ? classes.active : ""
        }`}
      >
        <Link
          href={{
            pathname: "/notification",
          }}
        >
          <a className={`${classes[`link-text`]}`}>
            <MdNotificationsNone />
            <span className={classes.pcOnly}>Notifications</span>
          </a>
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
            pathname: `/${encodeURIComponent(user.username)}`,
          }}
        >
          <a className={`${classes[`link-text`]}`}>
            <RiAccountCircleLine />
            <span className={classes.pcOnly}>Account</span>
          </a>
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
