import { useState, useEffect,type ReactElement } from "react";
import type { NextComponentType } from 'next';
import { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { SocketProvider } from "../utils/context/SocketContext";
import Head from "next/head";
import Router from "next/router";
import { UserLayout } from "../components/Layout";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import "../public/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "cropperjs/dist/cropper.css";

const MyApp:NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({ Component, pageProps }: AppLayoutProps) =>{
  const [toastrType, setToastrType] = useState<string>("");
  const [notificationUnread, setNotificationUnread] = useState<boolean>(false);
  // handle route change animation
  Router.events.on('routeChangeStart', () => {
    nProgress.start();
})
  Router.events.on('routeChangeComplete', () => {
  nProgress.done();
})
  Router.events.on('routeChangeError', () => {
  nProgress.done();
})
  // handle toast
  useEffect(() => {
    let timer:any;
    // delete post
    if (toastrType === "delete") {
      toast.info("Post Deleted Successfully", {
        toastId: "delete",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
      // create post
    } else if (toastrType === "create") {
      toast.info("Post Created Successfully", {
        toastId: "create",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
      // update post
    } else if (toastrType === "update") {
      toast.info("Updated Successfully", {
        toastId: "updated",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
    }
    return () => clearTimeout(timer);
  }, [toastrType]);
  
  const getLayout =
    Component.getLayout ||
    ((page:ReactElement) => (
      <UserLayout
        {...pageProps}
        setNotificationUnread={setNotificationUnread}
      >
        {page}
      </UserLayout>
    ));

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href="/logo.png"/>
        <title>Mini Social Media</title>
      </Head>
      <SocketProvider>
        {getLayout(
          <Component
            {...pageProps}
            setToastrType={setToastrType}
            notificationUnread={notificationUnread}
            setNotificationUnread={setNotificationUnread}
          />
        )}
      </SocketProvider>
    </>
  );
}

export default MyApp;
