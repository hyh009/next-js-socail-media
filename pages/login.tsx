import React, { ReactElement } from "react";
import type { NextLayoutComponentType } from 'next';
import {LoginHandler } from "../utils/types";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContent";
import useCheckLogin from "../utils/hooks/useCheckLogin";
import { NoUserLayout } from "../components/Layout";
import { loginUser } from "../utils/authUser";
import { LoginForm } from "../components/Form/AuthForm";


const Login:NextLayoutComponentType = () => {
  useCheckLogin(); //check if user islogin
  const handleLogin:LoginHandler = async (e, 
                            inputData, 
                            setErrorMsg, 
                            setFormLoading) => {
    e.preventDefault();
    setFormLoading(true);
    await loginUser(inputData, setErrorMsg, setFormLoading);
  };
  return (
    <>
      <Head>
        <title>{PAGE_TITLE.LOGIN}</title>
      </Head>
      <LoginForm submitHandler={handleLogin} />
    </>
  );
};

export default Login;

Login.getLayout = function PageLayout(page:ReactElement) {
  return <NoUserLayout>{page}</NoUserLayout>;
};
