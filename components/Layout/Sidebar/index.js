import classes from "./sidebar.module.css";
import { forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  RiLogoutBoxRLine,
  RiAccountCircleLine,
  RiMessage2Line,
  RiHome4Line,
} from "react-icons/ri";
import { MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
import { logoutUser } from "../../../utils/authUser";

const LinkText = forwardRef(
  ({ onClick, href, text, Icon, unread, mini }, ref) => {
    return (
      <a
        className={`${classes[`link-text`]} ${
          mini && classes[`mini-link-text`]
        }`}
        href={href}
        onClick={onClick}
        ref={ref}
      >
        <Icon style={{ color: unread ? "yellow" : "inherit" }} />
        <span className={`${classes.pcOnly} ${mini && classes.mini}`}>
          {text}
        </span>
      </a>
    );
  }
);

LinkText.displayName = "LinkText";

const Sidebar = ({ user, mini, notificationUnread }) => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;

  return (
    <div
      className={`${classes.container} ${mini && classes[`mini-container`]}`}
    >
      <div className={classes.logo}>
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
          title="Logo made by DesignEvo free logo creator"
        ></Image>
        <span className={classes.pcOnly}>Mini Social Media</span>
      </div>
      <ul
        className={`${classes[`list-container`]} ${
          mini && classes[`mini-list-container`]
        }`}
      >
        <li
          className={`${classes.list} ${mini && classes[`mini-list`]} ${
            isActive("/") ? classes.active : ""
          }`}
        >
          <Link
            href={{
              pathname: "/",
            }}
            passHref
          >
            <LinkText Icon={RiHome4Line} text="Home" mini={mini} />
          </Link>
        </li>
        <li
          className={`${classes.list} ${mini && classes[`mini-list`]}  ${
            isActive("/message") ? classes.active : ""
          }`}
        >
          <Link
            href={{
              pathname: "/message",
            }}
            passHref
          >
            <LinkText Icon={RiMessage2Line} text="Message" mini={mini} />
          </Link>
        </li>
        <li
          className={`${classes.list} ${mini && classes[`mini-list`]}  ${
            isActive("/notification") ? classes.active : ""
          }`}
        >
          <Link
            href={{
              pathname: "/notification",
            }}
            passHref
          >
            <LinkText
              Icon={
                notificationUnread ? MdNotificationsActive : MdNotificationsNone
              }
              text="Notifications"
              unread={notificationUnread}
              mini={mini} // don't show text on any device (for message page)
            />
          </Link>
        </li>
        <li
          className={`${classes.list} ${mini && classes[`mini-list`]}  ${
            isActive(`/[username]`) ? classes.active : ""
          }`}
        >
          <Link
            href={{
              pathname: `/${encodeURIComponent(user.username)}`,
            }}
            passHref
          >
            <LinkText Icon={RiAccountCircleLine} text="Account" mini={mini} />
          </Link>
        </li>
        <li
          className={`${classes.list} ${mini && classes[`mini-list`]} `}
          onClick={() => {
            logoutUser(user.email);
          }}
        >
          <span
            className={`${classes[`link-text`]} $${
              mini && classes[`mini-link-text`]
            } `}
          >
            <RiLogoutBoxRLine />
            <span className={mini ? classes.mini : classes.pcOnly}>Logout</span>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
