import {
  WelcomeMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import Center from "../components/Layout/Center";
import { LoginForm } from "../components/Form/AuthForm";
import { loginUser } from "../utils/authUser";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

const Login = () => {
  const handleLogin = async (e, inputData, setErrorMsg, setFormLoading) => {
    e.preventDefault();
    setFormLoading(true);
    await loginUser(inputData, setErrorMsg, setFormLoading);
  };
  return (
    <Center>
      <WelcomeMessage />
      <LoginForm submitHandler={handleLogin} />
      <FooterMessage />
    </Center>
  );
};

export const getServerSideProps = async (context) => {
  try {
    // if token exist and is valid, redirect to home page
    if (context.req.headers.cookie) {
      const res = await axios(`${baseUrl}/auth/verifyuser`, {
        withCredentials: true,
        headers: {
          Cookie: context.req.headers.cookie,
        },
      });
      if (res.data.message === "valid user") {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
    return { props: {} };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Login;
