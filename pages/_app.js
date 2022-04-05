import { useState, useEffect } from "react";
import Head from "next/head";
import MainLayout from "../components/Layout/MainLayout";
import "../public/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "cropperjs/dist/cropper.css";
import UtilContext from "../utils/context/UtilContext";
import { toast } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const [toastrType, setToastrType] = useState(false);
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
    } else if (toastrType === "update") {
      toast.info("Updated Successfully", {
        toastId: "updated",
      });
      timer = setTimeout(() => setToastrType(""), 1500);
    }
    return () => clearTimeout(timer);
  }, [toastrType]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />
        <title>Mini Social Media</title>
      </Head>
      <UtilContext.Provider
        value={{
          toastr: {
            toastrType: { toastrType },
            setToastrType: { setToastrType },
          },
        }}
      >
        <MainLayout {...pageProps}>
          <Component {...pageProps} setToastrType={setToastrType} />
        </MainLayout>
      </UtilContext.Provider>
    </>
  );
}

export default MyApp;
