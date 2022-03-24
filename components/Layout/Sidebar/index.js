import classes from "./sidebar.module.css";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  RiLogoutBoxRFill,
  RiAccountCircleFill,
  RiNotification2Fill,
  RiMessage3Fill,
  RiHome4Fill,
} from "react-icons/ri";
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
            <RiHome4Fill />
            Home
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
            <RiMessage3Fill />
            Message
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
            <RiNotification2Fill />
            Notifications
          </a>
        </Link>
      </li>
      <li
        className={`${classes.list} ${
          isActive(`${user.username}`) ? classes.active : ""
        }`}
      >
        <Link
          href={{
            pathname: `${user.username}`,
          }}
        >
          <a className={`${classes[`link-text`]}`}>
            <RiAccountCircleFill />
            Account
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
          <RiLogoutBoxRFill />
          Logout
        </span>
      </li>
    </ul>
  );
};

export default Sidebar;
