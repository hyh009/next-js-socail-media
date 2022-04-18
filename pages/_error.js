import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContnet";
import { ErrorPageLayout } from "../components/Layout";
import { Button } from "../components/Common";

const Error = ({ statusCode }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{PAGE_TITLE.ERROR}</title>
      </Head>
      <div>
        <h1 style={{ margin: "20px 0" }}>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </h1>
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
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

error.getLayout = function PageLayout(page) {
  return <ErrorPageLayout>{page}</ErrorPageLayout>;
};
