import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import classes from "./WelcomeMessage.module.css";
import { FcSettings, FcKey } from "react-icons/fc";
import { BiHelpCircle } from "react-icons/bi";

export const WelcomeMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <div className={classes[`form-header`]}>
      {signupRoute ? (
        <FcSettings className={classes[`welcome-icon`]} />
      ) : (
        <FcKey className={classes[`welcome-icon`]} />
      )}

      <div className={classes[`text-container`]}>
        <h3 className={classes[`welcome-title`]}>
          {signupRoute ? "Get Started" : "Welcome Back"}
        </h3>
        <p className={classes[`text`]}>
          {signupRoute ? "Create New Account" : "Login with email & password"}
        </p>
      </div>
    </div>
  );
};

export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <div className={classes[`form-footer`]}>
      {signupRoute ? (
        <>
          <BiHelpCircle className={classes[`help-icon`]} />
          <p className={classes[`footer-text`]}>
            Existing user? <Link href="/login">click here to login</Link>
          </p>
        </>
      ) : (
        <>
          <BiHelpCircle className={classes[`help-icon`]} />
          <p className={classes[`footer-text`]}>
            New user? <Link href="/signup">Click here to signup</Link>
          </p>
        </>
      )}
    </div>
  );
};
