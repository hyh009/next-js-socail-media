import React from "react";
import { IconType } from "react-icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import classes from "./spinner.module.css";

export const Spinner:IconType = () => {
  return <AiOutlineLoading3Quarters className={classes.spinner} />;
};

export const DivSpinner:React.FC = () => {
  return (
    <div className={classes.container}>
      <AiOutlineLoading3Quarters className={classes.spinner} />
    </div>
  );
};
