import React from "react";
import classes from "./button.module.css";

export const Button = (props) => {
  const Icon = props.icon;
  return (
    <button
      type={props.type}
      className={`${classes[`basic-button`]} ${classes[props.look]} ${
        props.isDisable ? classes.disable : ""
      }`}
      disabled={props?.isDisable ? props.isDisable : false}
      onClick={
        props.arg
          ? (e) => {
              props.clickHandler(e, props.arg);
            }
          : props.clickHandler
          ? props.clickHandler
          : undefined
      }
    >
      {props.icon && <Icon />}
      {props.content}
    </button>
  );
};
