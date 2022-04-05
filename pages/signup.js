import { useState } from "react";
import { ProgressBar } from "../components/Common";
import { SignupForm } from "../components/Form/AuthForm";
import { registerUser } from "../utils/authUser";
import { uploadPic } from "../utils/uploadPicToCloudinary";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

const Signup = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const stepText = ["ACCOUNT SETUP", "PERSONAL DETAILS", "SOCIAL PROFILE"];
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
      <ProgressBar currentStep={currentStep} stepText={stepText} />
      <SignupForm
        submitHandler={handleSignup}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
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
