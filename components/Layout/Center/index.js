import React from "react";
import classes from "./center.module.css";

const Center = ({ children }) => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>{children}</div>
    </div>
  );
};

export default Center;
