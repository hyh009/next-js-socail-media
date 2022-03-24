import React from "react";
import classes from "./ErrorMsg.module.css";

export const InputErrorMsg = ({ errorMsg }) => {
  return (
    <div className={classes[`input-container`]}>
      <p className={classes[`input-text`]}>{errorMsg}</p>
    </div>
  );
};
