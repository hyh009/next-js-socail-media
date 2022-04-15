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
    const res = await axios.post(`${baseUrl}/api/signup`, {
      user,
      profilePicUrl,
    });
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
    const res = await axios.post(`${baseUrl}/api/auth`, { user });
    if (res.data.message === "Success!") {
      setErrorMsg("");
      setLoading(false);
      Router.push("/");
    }
  } catch (err) {
    const errorMsg = catchErrors(err);
    setErrorMsg(errorMsg);
    setLoading(false);
  }
};

// save email to set value of login page email input
export const logoutUser = async (email) => {
  cookie.set("userEmail", email);
  await axios(`${baseUrl}/api/auth/logout`);
  Router.push("/login");
  Router.reload();
};

export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    window.location.href = location;
  }
};
