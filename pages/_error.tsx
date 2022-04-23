import React, { ReactElement } from "react";
import type { NextLayoutComponentType } from 'next';
import { useRouter } from "next/router";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContent";
import { ErrorPageLayout } from "../components/Layout";
import { Button } from "../components/Common";

interface Props {
  statusCode?:number
}

const Error: NextLayoutComponentType<Props> = ({ statusCode }) => {
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

Error.getLayout = function PageLayout(page:ReactElement) {
  return <ErrorPageLayout>{page}</ErrorPageLayout>;
};
