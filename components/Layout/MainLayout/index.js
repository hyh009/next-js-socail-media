import { Fragment } from "react";
import Navbar from "../Navbar";
import classes from "./MainLayout.module.css";
import nProgress from "nprogress";
import Router from "next/router";
import { Search, Sidebar, ScrollToTopBtn } from "../index";

const MainLayout = ({ children, user }) => {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  return (
    <Fragment>
      <div id="backdrop-root" />
      {user ? (
        <>
          <div className={classes[`islogin-Container`]}>
            <Sidebar user={user} />
            <div className={classes[`content-container`]} id="scrollableDiv">
              {children}
            </div>
            <Search />
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className={classes[`notlogin-container`]}>{children}</div>
        </>
      )}
    </Fragment>
  );
};

export default MainLayout;
