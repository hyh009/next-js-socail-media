import { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import Cookies from "js-cookie";
import { Input, TextArea } from "../Input";
import { Button, ImageDragDrop, InputErrorMsg } from "../../Common";
import { BackDrop } from "../../Layout";
import classes from "./authForm.module.css";
import {
  BsFillPersonFill,
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsFacebook,
  BsInstagram,
  BsYoutube,
  BsTwitter,
  BsPencilSquare,
} from "react-icons/bs";
import { MdEmail, MdDoNotDisturbOn } from "react-icons/md";
import { SiStoryblok } from "react-icons/si";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { GoSignIn } from "react-icons/go";

export const SignupForm = ({
  submitHandler,
  imagePreview,
  setImagePreview,
  currentStep,
  setCurrentStep,
}) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const { name, email, password, bio } = inputs;

  //check if every required field is filled
  useEffect(() => {
    const isFilled = Object.values({
      name,
      email,
      bio,
      password,
    }).every((item) => Boolean(item));
    if (isFilled) setSubmitDisable(false);
    else setSubmitDisable(true);
  }, [name, email, bio, password]);

  // check if username available
  useEffect(() => {
    // use controller to cancel request when component unmounted (axios version > v0.22.0)
    const controller = new AbortController();
    const checkUsername = async () => {
      // if username is empty string return
      setUsernameLoading(true);
      if (username === "") {
        setErrorMsg("");
        setUsernameAvailable(false);
        setUsernameLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
          signal: controller.signal,
        });
        if (res.data.message === "Username is available") {
          setUsernameAvailable(true);
          setInputs((prev) => ({ ...prev, username }));
          setErrorMsg("");
        }
      } catch (err) {
        setUsernameAvailable(false);
        if (err.response?.data?.message) setErrorMsg(err.response.data.message);
      }
      setUsernameLoading(false);
    };
    // check if username is available every 300ms
    let timer = setTimeout(() => {
      checkUsername();
    }, 300);

    return () => {
      timer && clearTimeout(timer);
      // cancel request
      controller.abort();
    };
  }, [username]);

  // check if disable button
  useEffect(() => {
    setIsDisable(submitDisable || !usernameAvailable);
  }, [submitDisable, usernameAvailable]);

  // handle all input fields except username & image
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle username seperately (to check if username is available)
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // handle change step
  const handleChangeStep = (e, mode) => {
    if (mode === "next") {
      setCurrentStep((prev) => prev + 1);
    } else if (mode === "previous") {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <>
      {formLoading && <BackDrop />}
      <form
        className={classes.form}
        onSubmit={(e) =>
          submitHandler(e, inputs, imagePreview, setErrorMsg, setFormLoading)
        }
      >
        <div
          className={`${classes[`step-container`]} ${
            currentStep !== 0 && classes[`fade`]
          }`}
        >
          {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
          <Input
            type="text"
            name="name"
            placeholder="please enter your name"
            label="Name"
            value={name}
            require="require"
            icon={BsFillPersonFill}
            changeHandler={changeHandler}
          />
          <Input
            type="text"
            name="email"
            placeholder="please enter your eamil"
            label="Email"
            value={email}
            require="require"
            icon={MdEmail}
            changeHandler={changeHandler}
          />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="please enter your password"
            label="Password"
            value={password}
            require="require"
            icon={showPassword ? BsFillEyeFill : BsFillEyeSlashFill}
            setShowPassword={setShowPassword}
            changeHandler={changeHandler}
          />
          <Input
            type="username"
            name="username"
            placeholder="please enter your username"
            label="Username"
            value={username}
            require="require"
            invalid={
              usernameAvailable === false &&
              username !== "" &&
              usernameLoading === false
            }
            icon={
              usernameAvailable || username === ""
                ? RiAccountPinBoxFill
                : MdDoNotDisturbOn
            }
            loading={usernameLoading}
            changeHandler={handleUsername}
          />
          <div className={classes[`button-container-right`]}>
            <Button
              type="button"
              content="next"
              clickHandler={(e) => handleChangeStep(e, "next")}
              look="black-small-button"
            />
          </div>
        </div>
        <div
          className={`${classes[`step-container`]} ${
            currentStep !== 1 && classes[`fade`]
          }`}
        >
          {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
          <ImageDragDrop
            setImagePreview={setImagePreview}
            imagePreview={imagePreview}
          />
          <TextArea
            type="bio"
            name="bio"
            placeholder="please enter your bio"
            label="Bio"
            value={bio}
            require="require"
            rows="2"
            icon={SiStoryblok}
            changeHandler={changeHandler}
          />
          <div className={classes[`button-container`]}>
            <Button
              type="button"
              content="previous"
              clickHandler={(e) => handleChangeStep(e, "previous")}
              look="black-small-button"
            />
            <Button
              type="button"
              content="next"
              clickHandler={(e) => handleChangeStep(e, "next")}
              look="black-small-button"
            />
          </div>
        </div>
        <div
          className={`${classes[`step-container`]} ${
            currentStep !== 2 && classes[`fade`]
          }`}
        >
          {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
          <Input
            type="text"
            name="facebook"
            placeholder="please enter your facebook account"
            label="Facebook"
            value={inputs.facebook}
            icon={BsFacebook}
            changeHandler={changeHandler}
          />
          <Input
            type="text"
            name="twitter"
            placeholder="please enter your twitter account"
            label="Twitter"
            value={inputs.twitter}
            icon={BsTwitter}
            changeHandler={changeHandler}
          />
          <Input
            type="text"
            name="instagram"
            placeholder="please enter your instagram account"
            label="Instagram"
            value={inputs.instagram}
            icon={BsInstagram}
            changeHandler={changeHandler}
          />
          <Input
            type="text"
            name="youtube"
            placeholder="please enter your youtube account"
            label="Youtube"
            value={inputs.youtube}
            icon={BsYoutube}
            changeHandler={changeHandler}
          />
          <div className={classes[`button-container`]}>
            <Button
              type="button"
              content="previous"
              clickHandler={(e) => handleChangeStep(e, "previous")}
              look="black-small-button"
            />
            <Button
              type="submit"
              content="Signup"
              look="signup-button"
              icon={BsPencilSquare}
              isDisable={isDisable}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export const LoginForm = ({ submitHandler }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const { email, password } = inputs;

  useEffect(() => {
    const userEmail = Cookies.get("userEmail");
    if (userEmail) {
      setInputs((prev) => ({ ...prev, email: userEmail }));
    }
  }, []);

  useEffect(() => {
    const isFiled = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );
    if (isFiled) setSubmitDisable(false);
    else setSubmitDisable(true);
  }, [email, password]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      {formLoading && <BackDrop />}
      <form
        className={classes[`login-form`]}
        onSubmit={(e) => submitHandler(e, inputs, setErrorMsg, setFormLoading)}
      >
        {errorMsg && <InputErrorMsg errorMsg={errorMsg} />}
        <Input
          type="email"
          name="email"
          placeholder="please enter your eamil"
          label="Email"
          value={email}
          require="require"
          icon={MdEmail}
          changeHandler={changeHandler}
        />
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="please enter your password"
          label="Password"
          value={password}
          require="require"
          icon={showPassword ? BsFillEyeFill : BsFillEyeSlashFill}
          setShowPassword={setShowPassword}
          changeHandler={changeHandler}
        />
        <Button
          type="submit"
          content="Login"
          look="signup-button"
          isDisable={submitDisable}
          icon={GoSignIn}
        />
      </form>
    </>
  );
};
