import { useState, useEffect } from "react";
import { SocketProvider } from "../utils/context/SocketContext";
import Head from "next/head";
import Router from "next/router";
import { UserLayout } from "../components/Layout";
import { toast } from "react-toastify";
import nProgress from "nprogress";
import "../public/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "cropperjs/dist/cropper.css";

function MyApp({ Component, pageProps }) {
  const [toastrType, setToastrType] = useState(false);
  const [notificationUnread, setNotificationUnread] = useState(false);
  // handle route change animation
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  // handle toast
  useEffect(() => {
    let timer;
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
    ((page) => (
      <UserLayout
        {...pageProps}
        notificationUnread={notificationUnread}
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
        <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />
        <title>Mini Social Media</title>
      </Head>
      <SocketProvider>
        {getLayout(
          <Component
            {...pageProps}
            setToastrType={setToastrType}
            setNotificationUnread={setNotificationUnread}
          />
        )}
      </SocketProvider>
    </>
  );
}

export default MyApp;
