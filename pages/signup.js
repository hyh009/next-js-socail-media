import { useState } from "react";
import Center from "../components/Layout/Center";
import {
  WelcomeMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import { SignupForm } from "../components/Form/AuthForm";
import { ImageDragDrop } from "../components/Common";
import { registerUser } from "../utils/authUser";
import { uploadPic } from "../utils/uploadPicToCloudinary";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

const Signup = () => {
  const [imagePreview, setImagePreview] = useState("");
  const handleSignup = async (
    e,
    inputData,
    imageBase64String,
    setErrorMsg,
    setFormLoading
  ) => {
    e.preventDefault();
    setFormLoading(true);
    let profilePicUrl;
    if (imageBase64String) {
      profilePicUrl = await uploadPic(imageBase64String);
    }
    // handle uploading image error
    if (imageBase64String !== "" && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg("Error occurs when updating image");
    }

    await registerUser(inputData, profilePicUrl, setErrorMsg, setFormLoading);
  };

  return (
    <>
      <WelcomeMessage />
      <ImageDragDrop
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
      <SignupForm submitHandler={handleSignup} imagePreview={imagePreview} />
      <FooterMessage />
    </>
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
export default Signup;
