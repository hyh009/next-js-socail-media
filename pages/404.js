import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContnet";
import { ErrorPageLayout } from "../components/Layout";
import { Button } from "../components/Common";

const Custom404 = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{PAGE_TITLE.FOUROFOUR}</title>
      </Head>
      <div>
        <h1 style={{ margin: "20px 0" }}>404 - Page Not Found</h1>
        <Button
          type="button"
          content="go back"
          look="small-button"
          clickHandler={() => router.back()}
        />
      </div>
    </>
  );
};
export default Custom404;

Custom404.getLayout = function PageLayout(page) {
  return <ErrorPageLayout>{page}</ErrorPageLayout>;
};
