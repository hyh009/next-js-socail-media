import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import Router from "next/router";
import cookie from "js-cookie";

export const registerUser = async (
  user,
  profilePicUrl,
  setErrorMsg,
  setLoading
) => {
  try {
    const res = await axios.post(`${baseUrl}/signup`, { user, profilePicUrl });
    if (res.data.message === "user created") {
      // redirect to login page
      Router.push("/login");
    } else {
      throw new Error("something went wrong");
    }
  } catch (err) {
    const errorMsg = catchErrors(err);
    setErrorMsg(errorMsg);
  }
  setLoading(false);
};

export const loginUser = async (user, setErrorMsg, setLoading) => {
  try {
    const res = await axios.post(`${baseUrl}/auth`, { user });
    const token = res.data;
    await axios.post(`${baseUrl}/auth/setcookie`, { token });
    Router.push("/");
  } catch (err) {
    const errorMsg = catchErrors(err);
    setErrorMsg(errorMsg);
  }
  setLoading(false);
};

// save email to set value of login page email input
export const logoutUser = async (email) => {
  cookie.set("userEmail", email);
  await axios(`${baseUrl}/auth/logout`);
  Router.push("/login");
  Router.reload();
};
