import { useState } from "react";
import Head from "next/head";
import { PAGE_TITLE } from "../utils/headContnet";
import { NoUserLayout } from "../components/Layout";
import { ProgressBar } from "../components/Common";
import { SignupForm } from "../components/Form/AuthForm";
import { registerUser } from "../utils/authUser";
import { uploadPic } from "../utils/uploadPicToCloudinary";
import useCheckLogin from "../utils/hooks/useCheckLogin";

const Signup = () => {
  useCheckLogin(); //check if user islogin
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
      <Head>
        <title>{PAGE_TITLE.SINGUP}</title>
      </Head>
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

export default Signup;

Signup.getLayout = function PageLayout(page) {
  return <NoUserLayout>{page}</NoUserLayout>;
};
