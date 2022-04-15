import Navbar from "../Navbar";
import classes from "./MainLayout.module.css";
import { Search, Sidebar } from "../index";
import { useEffect } from "react";

export const UserLayout = ({
  children,
  user,
  notificationUnread,
  setNotificationUnread,
}) => {
  useEffect(() => {
    setNotificationUnread(user.unreadNotification);
  }, [user, setNotificationUnread]);

  return (
    <>
      <div id="backdrop-root" />
      <div className={classes[`islogin-Container`]}>
        <Sidebar user={user} notificationUnread={notificationUnread} />
        <div className={classes[`content-container`]} id="scrollableDiv">
          {children}
        </div>
        <Search />
      </div>
    </>
  );
};

export const MessageLayout = ({
  children,
  user,
  setNotificationUnread,
  notificationUnread,
}) => {
  useEffect(() => {
    setNotificationUnread(user.unreadNotification);
  }, [user, setNotificationUnread]);
  return (
    <>
      <div id="backdrop-root" />
      <div className={classes[`message-container`]}>
        <Sidebar
          user={user}
          mini={true}
          notificationUnread={notificationUnread}
        />
        <div className={classes[`message-content-container`]}>{children}</div>
      </div>
    </>
  );
};

export const NoUserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className={classes[`notlogin-container`]}>
        <div id="backdrop-root" />
        <div className={classes.center}>
          <div className={classes[`center-wrapper`]}>{children}</div>
        </div>
      </div>
    </>
  );
};

export const ErrorPageLayout = ({ children }) => {
  return (
    <>
      <Navbar errorPage={true} />
      <div className={classes[`error-wrapper`]}>{children}</div>
    </>
  );
};
