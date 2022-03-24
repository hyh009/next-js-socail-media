import { useState, useEffect } from "react";
import { Input, TextArea } from "../Input";
import { Button } from "../../Common/Button";
import { InputErrorMsg } from "../../Common/ErrorMsg";
import BackDrop from "../../Layout/BackDrop";
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
import { GrValidate } from "react-icons/gr";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { SiStoryblok } from "react-icons/si";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { GoSignIn } from "react-icons/go";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import Cookies from "js-cookie";

export const SignupForm = ({ submitHandler, imagePreview }) => {
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
  const [showSocialLinks, setSocialLinks] = useState(false);
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
        const res = await axios.get(`${baseUrl}/signup/${username}`, {
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

  // click and show socialLink input
  const handleSocialLink = (e) => {
    e.preventDefault();
    setSocialLinks((prev) => !prev);
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
            username === ""
              ? RiAccountPinBoxFill
              : usernameLoading
              ? CgSpinnerTwoAlt
              : !usernameAvailable
              ? MdDoNotDisturbOn
              : GrValidate
          }
          iconAnimation={usernameLoading && "spin"}
          changeHandler={handleUsername}
        />
        <TextArea
          type="bio"
          name="bio"
          placeholder="please enter your bio"
          label="Bio"
          value={bio}
          require="require"
          icon={SiStoryblok}
          changeHandler={changeHandler}
        />
        <Button
          content={showSocialLinks ? "Hide social link" : "Add social link"}
          look="black-half-button"
          clickHandler={handleSocialLink}
        />
        {showSocialLinks && (
          <>
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
          </>
        )}
        <Button
          type="submit"
          content="Signup"
          look="signup-button"
          icon={BsPencilSquare}
          isDisable={isDisable}
        />
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
  }, [inputs]);

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
        className={classes.form}
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
