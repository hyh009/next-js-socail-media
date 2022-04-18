import Navbar from "../Navbar";
import classes from "./MainLayout.module.css";
import { Search, Sidebar } from "../index";
import { useEffect } from "react";
import Error from "next/error";

export const UserLayout = ({
  children,
  user,
  notificationUnread,
  setNotificationUnread,
  errorCode,
}) => {
  useEffect(() => {
    if (user) {
      setNotificationUnread(user.unreadNotification);
    }
  }, [user, setNotificationUnread]);

  // handle error loading on getServerSideProps
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
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
  errorCode,
}) => {
  // handle error loading on getServerSideProps

  useEffect(() => {
    if (user) {
      setNotificationUnread(user.unreadNotification);
    }
  }, [user, setNotificationUnread]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
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
