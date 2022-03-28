import Head from "next/head";
import MainLayout from "../components/Layout/MainLayout";
import "../public/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "cropperjs/dist/cropper.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />
        <title>Mini Social Media</title>
      </Head>
      <MainLayout {...pageProps}>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

export default MyApp;
