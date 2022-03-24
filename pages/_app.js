import MainLayout from "../components/Layout/MainLayout";

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout {...pageProps}>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
