import { Fragment } from "react";
import Navbar from "../Navbar";
import classes from "./MainLayout.module.css";
import nProgress from "nprogress";
import Router from "next/router";
import { Search, Sidebar } from "../index";
import { useRouter } from "next/router";

const MainLayout = ({ children, user }) => {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  const router = useRouter();
  const errorPage = router.asPath === "/404" || "/500";

  return (
    <Fragment>
      {user ? (
        <>
          <div id="backdrop-root" />
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
          <Navbar errorPage={errorPage} />
          {errorPage ? (
            <div className={classes[`error-wrapper`]}>{children}</div>
          ) : (
            <div className={classes[`notlogin-container`]}>
              <div id="backdrop-root" />
              <div className={classes.center}>
                <div className={classes[`center-wrapper`]}>{children}</div>
              </div>
            </div>
          )}
        </>
      )}
    </Fragment>
  );
};

export default MainLayout;
