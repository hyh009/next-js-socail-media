import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContnet";
import useCheckLogin from "../utils/hooks/useCheckLogin";
import { NoUserLayout } from "../components/Layout";
import { loginUser } from "../utils/authUser";
import { LoginForm } from "../components/Form/AuthForm";

const Login = () => {
  useCheckLogin(); //check if user islogin
  const handleLogin = async (e, inputData, setErrorMsg, setFormLoading) => {
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

Login.getLayout = function PageLayout(page) {
  return <NoUserLayout>{page}</NoUserLayout>;
};
