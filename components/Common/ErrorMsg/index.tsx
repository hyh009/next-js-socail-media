import React from "react";
import classes from "./ErrorMsg.module.css";
interface Props  {
  errorMsg:string
}
export const InputErrorMsg:React.FC<Props> = ({ errorMsg }) => {
  return (
    <div className={classes[`input-container`]}>
      <p className={classes[`input-text`]}>{errorMsg}</p>
    </div>
  );
};
