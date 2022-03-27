import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import classes from "./spinner.module.css";

export const Spinner = () => {
  return <AiOutlineLoading3Quarters className={classes.spinner} />;
};

export const DivSpinner = () => {
  return (
    <div className={classes.container}>
      <AiOutlineLoading3Quarters className={classes.spinner} />
    </div>
  );
};
