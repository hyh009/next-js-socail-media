import useCheckLogin from "../utils/hooks/useCheckLogin";
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
      <LoginForm submitHandler={handleLogin} />
    </>
  );
};

export default Login;
