import React, { ReactElement } from "react";
import type { NextLayoutComponentType } from 'next';
import { useRouter } from "next/router";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContent";
import { ErrorPageLayout } from "../components/Layout";
import { Button } from "../components/Common";

const Custom500:NextLayoutComponentType = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{PAGE_TITLE.FIVEOO}</title>
      </Head>
      <div>
        <h1 style={{ margin: "20px 0" }}>500 - Server Error</h1>
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
export default Custom500;

Custom500.getLayout = function PageLayout(page:ReactElement) {
  return <ErrorPageLayout>{page}</ErrorPageLayout>;
};
