import React,{Dispatch,SetStateAction} from "react";
import {IUser} from "../../../utils/types"
import Navbar from "../Navbar";
import classes from "./MainLayout.module.css";
import { Search, Sidebar } from "../index";
import { useEffect } from "react";
import Error from "next/error";
interface LoginProps {
  children:React.ReactNode
  user:IUser
  notificationUnread:boolean,
  setNotificationUnread:Dispatch<SetStateAction<boolean>>,
  errorCode?:number,
}

interface MessageProps {
  children:React.ReactNode
  user:IUser
  setNotificationUnread:Dispatch<SetStateAction<boolean>>,
  notificationUnread:boolean,
  errorCode?:number
}

interface NoUserProps {
  children:React.ReactNode
}

export const UserLayout:React.FC<LoginProps> = ({
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

export const MessageLayout:React.FC<MessageProps> = ({
  children,
  user,
  setNotificationUnread,
  notificationUnread,
  errorCode,
}) => {

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

export const NoUserLayout:React.FC<NoUserProps> = ({ children }) => {
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

export const ErrorPageLayout:React.FC<NoUserProps> = ({ children }) => {
  return (
    <>
      <Navbar errorPage={true} />
      <div className={classes[`error-wrapper`]}>{children}</div>
    </>
  );
};
