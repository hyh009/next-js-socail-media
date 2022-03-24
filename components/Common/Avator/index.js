import React from "react";
import classes from "./avator.module.css";

const Avator = (props) => {
  return (
    <div
      className={`${
        props.size === "small"
          ? classes[`small-container`]
          : props.size === "auto"
          ? classes[`auto-container`]
          : classes.container
      } ${props.shape === "circle" && classes[`circle`]} ${
        props.border ? classes[props.border] : ""
      }`}
      title={props.alt}
    >
      <img src={props.src} alt={props.alt} className={classes.image} />
    </div>
  );
};

export default Avator;
